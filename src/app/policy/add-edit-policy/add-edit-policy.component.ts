import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ElementFinder } from 'protractor';
import { BaseComponent } from 'src/app/app-shared/base/base.component';
import { BasicValue } from 'src/app/basicinfo/basic-value/basic-value.model';
import { BasicValueService } from '../../basicinfo/basic-value/basic-value.service';
import { ActionsModel } from '../models/actions.model';
import { numberCondition, stringCondition } from '../models/Conditions';
import { ElementModel } from '../models/element.model';
import { FieldsModel } from '../models/fields.model';
import { PolicySet } from '../models/policy.model';
import { RuleModel } from '../models/rule.model';
import { PolicySetService } from '../services/policy-set.service';


@Component({
  selector: 'app-add-edit-policy',
  templateUrl: './add-edit-policy.component.html',
  styleUrls: ['./add-edit-policy.component.scss']
})
export class AddEditPolicyComponent extends BaseComponent implements OnInit {
  cols: any[];
  editMode: boolean = false;
  isDisabled: boolean = false;
  policiesTreeTable: TreeNode[] = [];
  selectedpoliciesTreeTable: TreeNode;
  @Input() visible: boolean;
  @Input() selectBtn: string;
  @Input() selectedRow: PolicySet = new PolicySet();
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  displayFilter: boolean;
  selectedNode: any;
  elementModel: ElementModel[] = []
  // Ruleform: FormGroup;
  policy: PolicySet = new PolicySet();
  action: ActionsModel = new ActionsModel();
  private actionIndex: number;
  params: Params;
  display: boolean = false;
  moduleHeaderString: string;
  attributeID: number;
  ActionFields: FieldsModel[];
  // rules: Rule[] = [];
  rules: RuleModel[] = []
  stringConditions: stringCondition = new stringCondition();
  numberConditions: numberCondition = new numberCondition();
  ActionFieldSelected: FieldsModel;
  Basicvalues: BasicValue[] = [];


  constructor(
    private policyService: PolicySetService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: BasicValueService
  ) {
    super();
    this.setCols();
  }

  ngOnInit() {
    this.editMode = (this.activatedRoute.snapshot.url[0].path === "edit");
    this.form = this.fb.group({
      name: [''],
      description: [''],
      active: [true]
    });
    this.activatedRoute.params.subscribe(params => {
      this.params = params;
      if (params.id) {
        this.onFetchPoliciesTreeTable(params.id);
      } else {
        this.onFetchPoliciesTreeTable();
      }
    });
  }


  hide() {
    this.visibleChange.emit(false);
  }

  onFetchPoliciesTreeTable(id?) {
    let treeTable: TreeNode[] = [];
    let Tdata: ElementModel;
    if (id == null) {
      this.policyService.getPolicyCategories().subscribe(res => {
        var categories: ElementModel[] = res;
        if (categories) {

          categories.forEach((item) => {
            item.actions.sort((a, b) => a.name > b.name ? -1 : 1);
            Tdata = generateForTreeTable(item)
            treeTable.push({ data: Tdata, children: Tdata.children })
          });
          this.policiesTreeTable = treeTable;

        }
      })
    } else {
      this.policyService.getPolicySet(id).subscribe((result: PolicySet) => {
        if (result.id == 1) {
          this.onBack();
          return;
        }

        if (id) {
          this.form.controls['name'].setValue(result.name);
          this.form.controls['description'].setValue(result.description);
          this.form.controls['active'].setValue(result.active);

          this.isDisabled = !result.deletable;
          if (this.isDisabled) {
            this.form.controls['active'].disable();
          }
        }

        var categories: ElementModel[] = result.categories;
        if (categories) {
          // elements.sort((a, b) => a.id > b.id ? 1 : -1);
          // elements.map(x => x.actions.sort((a, b) => a.id > b.id ? 1 : -1));
          categories.forEach((item) => {
            item.actions.sort((a, b) => a.name > b.name ? -1 : 1);

            Tdata = generateForTreeTable(item)
            treeTable.push({ data: Tdata, children: Tdata.children })
          });
          this.policiesTreeTable = treeTable;
        }
      });
    }

  }

  onBack() {
    this.router.navigateByUrl('policy/list');
  }

  onFilter(rowData, type, action, index) {
    this.action = action;
    this.selectedNode = rowData;
    this.selectedNode.type = type;
    this.displayFilter = true;
    this.actionIndex = index;
  }

  addToRuls() {

    this.elementModel[this.elementModel.length - 1].actions.forEach(action => {
      this.rules.forEach(rule => {
        if (action.attributes.id === rule.attributesId) {
          action.attributes.rules = [];
          this.rules.forEach(element => {
            element.fieldId = element.field.id;
            if (element.valuesList) {
              var str = element.valuesList.toString();
            }
            element.valuesList = [];
            element.condition = element.conditionModel.label;
            if (element.field.valueClassId) { // do next
              if (element.valuesListItem?.length > 0) {
                element.valuesListItem.forEach(value => {
                  element.valuesList.push(value.id.toString());
                })
              }
            }
            else {
              element.valuesList.push(str)
            }
            action.attributes.rules.push(element);
          });
        }
      });
    })
    this.policy.name = this.form.value.name;
    this.policy.description = this.form.value.description;
    this.policy.active = this.form.value.active;
    if (this.params.id) {
      this.policy.id = this.params.id;
    }
    this.policy.categories = []
    this.policiesTreeTable.forEach(item => {
      this.elementModel.forEach(elmentItem => {
        if (item.data?.id === elmentItem.id) {
          item.data = elmentItem;
        }
        this.policy.categories.push(item.data);
      });
    });
    this.display = false;
  }
  onSubmit() {

    this.policy.name = this.form.value.name;
    this.policy.description = this.form.value.description;
    this.policy.active = this.form.value.active;
    if (this.params.id) {
      this.policy.id = Number(this.params.id);
    }
    this.policy.categories = []
    this.policiesTreeTable.forEach(item => {

      this.policy.categories.push(generateDataToPost(item.data));
    });
    this.policyService.editPolicy(this.policy).subscribe(() => {
      this.router.navigateByUrl('policy/list');
    }, error => {
      console.error(error);
    });
  }

  createdQuery($event: any) {
    this.policiesTreeTable.forEach(item => {
      if (this.selectedNode.id === item.data.id) {
        if ($event.rules === []) {
          item.data.actions[this.actionIndex].query = {};
        } else {
          item.data.actions[this.actionIndex].query = $event;
        }
      }
    });
  }

  showDialog(SelectedTreeNode: ElementModel, selectedActionModel: ActionsModel) {
    this.elementModel.push(SelectedTreeNode);
    this.moduleHeaderString = SelectedTreeNode.persianName;
    this.attributeID = selectedActionModel.attributes.id;
    this.display = true;
    this.ActionFields = selectedActionModel.fields.sort((a, b) => a.name > b.name ? 1 : -1);
    this.rules = [];
    selectedActionModel.attributes.rules.forEach(element => {
      let newrule: RuleModel = <RuleModel>{};
      newrule.valuesList = [];
      if (typeof (element?.condition) === 'string') {
        var tC = this.getConditions(null);
        newrule.condition = element.condition
        newrule.conditionModel = tC.filter(item => item.label === element.condition.toString())[0]
      }
      // newrule.condition = element.condition;
      newrule.attributesId = element.attributesId;
      if (element?.conditionModel?.label) {
        newrule.condition = element.conditionModel.label;
        newrule.conditionModel = element.conditionModel;
      }

      newrule.fieldId = element.fieldId;
      newrule.field = this.ActionFields.filter(item => item.id === newrule.fieldId)[0]

      newrule.id = element.id;
      element.valuesListItem = [];// do next
      if (newrule?.field?.valueClassType) {
        this.getBasics(newrule, element.valuesList);
        
        
      }
      else {
        newrule.valuesList.push(element.valuesList.toString());
      }
      this.rules.push(newrule);
    });


  }

  deleteRule(rule) {
    this.rules = this.rules.filter(item => item !== rule);

    this.elementModel[this.elementModel.length - 1].actions.forEach(action => {
      if (action.attributes.id === rule.attributesId) {
        action.attributes.rules = [];
        this.rules.forEach(element => {
          element.fieldId = element.field.id;
          var str = element.valuesList.toString();
          element.valuesList = [];
          element.condition = element.conditionModel.label;
          element.valuesList.push(str)
          action.attributes.rules.push(element);
        });
      }
    });
  }

  AddNewRule() {
    this.rules.push(this.createNewRule());
  }

  createNewRule(): RuleModel {
    return <RuleModel>{ fieldId: null, attributesId: this.attributeID, condition: null, valuesList: null };
  }

  getConditions(field: any) {
    if (field?.field?.valueType === 'string') {
      return this.stringConditions.stringConditions;
    } else {
      return this.numberConditions.numberConditions;
    }
  }

  setCols() {
    this.cols =
      [
        { field: 'persianName', header: 'persianName' },

      ];
  }
  getBasics(newrule: RuleModel | number, valuesList: string[]): any {
    if (typeof(newrule)=="number"){
      this.service.getBasicInfoWithChildren(newrule).subscribe(res => {
        this.Basicvalues = res.children;
        //newrule.valuesListItem = this.Basicvalues.filter(x => valuesList.includes(x.code.toString()));
      }, error => {
        console.error(error);
      });
    }
    else if (newrule.field.valueClassId) {
      this.service.getBasicInfoWithChildren(newrule.field.valueClassId).subscribe(res => {
        this.Basicvalues = res.children;
        newrule.valuesListItem = this.Basicvalues.filter(x => valuesList.includes(x.id.toString()));
      }, error => {
        console.error(error);
      });
      
    }
  }
}
function generateForTreeTable(item: any) {

  let Tchilderen: TreeNode[] = [];
  const Tdata: ElementModel = new ElementModel();
  if (item.actions) {
    Tdata.actions = item.actions;
  }
  if (item.id) {
    Tdata.id = item.id;
  }
  if (item.name) {
    Tdata.name = item.name;
  }
  if (item.persianName) {
    Tdata.persianName = item.persianName;
  }
  // Tchilderen = item.children;
  if (item.children.length > 0) {
    item.children.forEach(element => {
      const c = generateForTreeTable(element);
      Tdata.children.push({ children: c.children, data: c });
    });
  }
  else if (item?.data) {
    // item.data.forEach(element => {
    //   const c = generateDataForTreeTable(element);
    Tdata.children.push({ children: item.children, data: item.data });
    // });
  }
  return Tdata;
}

function generateDataToPost(item: ElementModel) {

  let Tdata: ElementModel = new ElementModel();
  if (item.actions) {
    Tdata.actions = item.actions;
  }
  if (item.id) {
    Tdata.id = item.id;
  }
  if (item.name) {
    Tdata.name = item.name;
  }
  if (item.persianName) {
    Tdata.persianName = item.persianName;
  }
  // Tchilderen = item.children;
  if (item.children.length > 0) {
    item.children.forEach(element => {
      const c = generateDataToPost(element.data);
      Tdata.children.push(c);

    });
  }
  return Tdata;
}

