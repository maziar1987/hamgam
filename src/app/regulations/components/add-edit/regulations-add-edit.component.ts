import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { BaseComponent } from '../../../app-shared/base/base.component';
import { RegulationsService } from '../../regulations.service';
import { RegulationCertificateService } from '../regulations-certificate/regulation-certificate.service';
import { RfpService } from '../rfp/rfp.service';
import { SpecializesTeamService } from '../specialized-team/specializedTeam.service';

@Component({
  selector: 'app-regulations-add-edit',
  templateUrl: './regulations-add-edit.component.html',
  styleUrls: ['./regulations-add-edit.component.scss']
})
export class RegulationsAddEditComponent extends BaseComponent implements OnInit {
  regulationsMenu: TreeNode[] = [];
  urlTypeParam = 'certificate';
  activityId: number;
  wfTaskId: string;
  workflowStep: string;
  senderUserId: number;

  certificateTitle = '';
  certificateId: number;

  constructor(private regulationsService: RegulationsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private certificateService: RegulationCertificateService,
    private rfpService: RfpService,
    private specializesTeamService: SpecializesTeamService) {
    super();
  }

  ngOnInit(): void {
    this.loadMenu();
    this.loadData();
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe(p => {
      this.certificateId = +p.get('id');
      this.urlTypeParam = p.get('type') ?? 'certificate';
      this.activityId = +p.get('aid');
      this.wfTaskId = p.get('wfTaskId');
      this.workflowStep = p.get('workflowStep');
      this.senderUserId = +p.get('senderUserId');

      if (this.certificateId) {
        this.certificateService.getCertificate(this.certificateId).subscribe(res => {
          this.certificateTitle = res.title;
        }, error => {
          console.error(error);
        });
      }
    });
  }

  loadMenu() {
    this.regulationsService.getRegulationsTree().subscribe(result => {
      this.regulationsMenu = result.data;
    });
  }

  selectNode($event: any) {
    if (this.certificateId) {
      if (this.activityId) {
        this.router.navigate(['regulations/add-edit/' + $event.node.path + '/' + this.certificateId, {
          aid: this.activityId,
          wfTaskId: this.wfTaskId,
          workflowStep: this.workflowStep,
          senderUserId: this.senderUserId
        }]);
      } else {
        this.router.navigate(['regulations/add-edit/' + $event.node.path + '/' + this.certificateId]);
      }
    } else {
      if (this.activityId) {
        this.router.navigate(['regulations/add-edit/' + $event.node.path, {
          aid: this.activityId,
          wfTaskId: this.wfTaskId,
          workflowStep: this.workflowStep,
          senderUserId: this.senderUserId
        }]);
      } else {
        this.router.navigate(['regulations/add-edit/' + $event.node.path]);
      }
    }
  }

  addModeTree(tree: any) {
    this.regulationsMenu.push(tree.data.filter(x => x.path === 'certificate')[0]);
  }

  editModeTree(tree: any) {
    this.regulationsMenu.push(tree.data.filter(x => x.path === 'certificate')[0]);
    this.regulationsMenu.push(tree.data.filter(x => x.path === 'rfp')[0]);
    this.rfpService.getRfpByCertificate(this.certificateId).subscribe(rfp => {
      this.specializesTeamService.getSpecializesTeamByCertificate(this.certificateId).subscribe(spTeam => {
        this.regulationsMenu.push(tree.data.filter(x => x.path === 'specialized-team')[0]);
      });
    });
  }
}
