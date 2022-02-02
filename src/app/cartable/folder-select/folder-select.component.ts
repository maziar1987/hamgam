import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TreeNode } from 'primeng/api';
import { FolderService } from '../services/folder.service';
import { Folder } from '../models/folder.model';

@Component({
  selector: 'app-folder-select',
  templateUrl: './folder-select.component.html',
  styleUrls: ['./folder-select.component.scss']
})
export class FolderSelectComponent implements OnInit {

  folders: TreeNode[] = [];
  selectedFolder: TreeNode;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.folders = this.config.data;
  }

  ok() {
    this.ref.close(this.selectedFolder.data);
  }

  cancel() {
    this.ref.close();
  }

  validation(): boolean {
    if (!this.selectedFolder) return false;

    var folder: Folder = this.selectedFolder.data.folder;
    if (folder.parentId || folder.folderName == 'personal') return true

    return false;
  }

}
