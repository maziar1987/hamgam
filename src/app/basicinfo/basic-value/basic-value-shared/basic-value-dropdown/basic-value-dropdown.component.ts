import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { BasicValue, basicValueSortTypeEnum, basicValueStatusEnum, BasicValueType } from '../../basic-value.model';
import { BasicValueService } from '../../basic-value.service';

@Component({
  selector: 'app-basic-value-dropdown',
  templateUrl: './basic-value-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BasicValueDropdownComponent),
      multi: true
    }
  ]
})
export class BasicValueDropdownComponent implements OnInit, ControlValueAccessor {

  basicInfoParent: BasicValue;
  basicInfos: BasicValue[];
  basicInfoId: number;

  @Input() basicInfoItems: SelectItem[] = [];
  @Input() showClear: boolean = false;
  @Input() filter: boolean = false;
  @Input() placeholder: string = '';
  @Input() styleClass: string = '';
  @Input() readonly: boolean = false;
  @Input() basicValueType: BasicValueType;
  @Output() selectedItem: EventEmitter<any> = new EventEmitter();
  @Input() emptyFilterMessage: string = "اطلاعاتی یافت نشد";
  @Input() isDisabled: boolean = false;
  // isDisabled = false;

  // Function to call when the model changes.
  onChange = (_: any) => {
  };
  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => {
  };

  constructor(private basicInfoService: BasicValueService) {
  }

  ngOnInit() {
    if (this.basicInfoItems?.length <= 0) {
      this.basicInfoService.getBasicInfo(this.basicValueType).subscribe(res => {
        this.basicInfoParent = res;
        this.basicInfos = res.children;
        this.basicInfoItems = this.getChildItems(res);

        if (!this.basicInfoId) {
          this.basicInfoId = res.defaultValueId ? res.defaultValueId : this.basicInfoItems[0]?.value;
          this.onChange(this.basicInfoId);
          this.selectedItem.emit(this.basicInfos[0]);
        }
      }, error => {
        console.log(error);
      });
    }
  }

  getChildItems(basicInfo: BasicValue): SelectItem[] {
    if (basicInfo.sortType.toString() == basicValueSortTypeEnum[basicValueSortTypeEnum.ALPHABET]) {
      basicInfo.children.sort((a, b) => a.title > b.title ? 1 : -1);
    } else if (basicInfo.sortType.toString() == basicValueSortTypeEnum[basicValueSortTypeEnum.CODE]) {
      basicInfo.children.sort((a, b) => a.code > b.code ? 1 : -1);
    } else if (basicInfo.sortType.toString() == basicValueSortTypeEnum[basicValueSortTypeEnum.VIEWORDER]) {
      basicInfo.children.sort((a, b) => a.viewOrder > b.viewOrder ? 1 : -1);
    }

    return basicInfo.children.filter(x => x.status.toString() == basicValueStatusEnum[basicValueStatusEnum.ACTIVE]).map(x => <SelectItem>{
      label: x.title,
      value: x.id
    });
  }

  onChangeItem(event) {
    var item = this.basicInfos.find(x => x.id == this.basicInfoId);
    this.selectedItem.emit(item);
    this.onChange(this.basicInfoId);
  }

  writeValue(obj: any): void {
    // if (obj) {
      this.basicInfoId = obj;
    // } else {
    //   if (!this.showClear && this.basicInfoParent && this.basicInfoItems.length > 0) {
    //     this.basicInfoId = this.basicInfoParent.defaultValueId ? this.basicInfoParent.defaultValueId : this.basicInfoItems[0]?.value;
    //     this.onChange(this.basicInfoId);
    //     this.selectedItem.emit(this.basicInfos[0]);
    //   }
    // }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

}
