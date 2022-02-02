import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfirmationService, MenuItem, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { SidebarMenuItem, SidebarMenuItemType } from 'src/app/app-shared/components/sidebar/sidebar.model';
import { SidebarService } from 'src/app/app-shared/components/sidebar/sidebar.service';
import { UserService } from 'src/app/user/user.service';
import { BaseService } from '../../app-shared/base/base.service';
import { FolderSelectComponent } from '../folder-select/folder-select.component';
import { GetFolderNameComponent } from '../get-folder-name/get-folder-name.component';
import { ActivityArchive, ActivityMove, ActivityRestore, ActivityTrash, Folder, FolderMove, FolderNew, FolderRename } from '../models/folder.model';

@Injectable({
    providedIn: 'root',
})

export class FolderService extends BaseService {

    constructor(
        public userService: UserService,
        public sidebarService: SidebarService,
        private confirmationService: ConfirmationService,
        private dialogService: DialogService,
        private http: HttpClient) {
        super();
    }

    getMainPersonalFolderMenuItems(sidebarMenuItem: SidebarMenuItem): MenuItem[] {

        var folder: Folder = sidebarMenuItem.data;

        return <MenuItem[]>[
            {
                label: "پوشه جدید",
                icon: 'pi pi-plus text-success',
                command: () => {
                    const ref = this.dialogService.open(GetFolderNameComponent, {
                        header: 'ایجاد پوشه',
                        width: '50vw'
                    });
                    ref.onClose.subscribe((folderName: string) => {
                        if (folderName) {
                            this.newFolder(<FolderNew>{ folderName: folderName, parentId: folder.id }).subscribe(res => {
                                this.addSidebarMenuItem(res, sidebarMenuItem);
                            });
                        }
                    });
                }
            }
        ];
    }

    getPersonalFolderMenuItems(sidebarMenuItem: SidebarMenuItem): MenuItem[] {

        var folder: Folder = sidebarMenuItem.data;

        return <MenuItem[]>[
            {
                label: "پوشه جدید",
                icon: 'pi pi-plus text-success',
                command: () => {
                    const ref = this.dialogService.open(GetFolderNameComponent, {
                        header: 'ایجاد پوشه',
                        width: '50vw'
                    });
                    ref.onClose.subscribe((folderName: string) => {
                        if (folderName) {
                            this.newFolder(<FolderNew>{ folderName: folderName, parentId: folder.id }).subscribe(res => {
                                this.addSidebarMenuItem(res, sidebarMenuItem);
                            });
                        }
                    });
                }
            },
            {
                label: "تغییر نام",
                icon: 'pi pi-plus text-success',
                command: () => {
                    const ref = this.dialogService.open(GetFolderNameComponent, {
                        header: 'ایجاد پوشه',
                        width: '50vw'
                    });
                    ref.onClose.subscribe((folderName: string) => {
                        if (folderName) {
                            this.renameFolder(<FolderRename>{ folderName: folderName, id: folder.id }).subscribe(res => {
                                sidebarMenuItem.lable = folderName;
                                // this.sidebarService.setSidebarMenuItems();
                            });
                        }
                    });
                }
            },
            {
                label: "انتقال پوشه",
                icon: 'pi pi-angle-double-right text-success',
                command: () => {
                    const ref = this.dialogService.open(FolderSelectComponent, {
                        header: 'انتخاب پوشه',
                        width: '50vw',
                        data: this.getCurrentFoldersTree()
                    });
                    ref.onClose.subscribe((result: { sidebarMenuItem: SidebarMenuItem, folder: Folder }) => {
                        if (result) {
                            this.moveFolder(<FolderMove>{ id: folder.id, parentId: result.folder.id }).subscribe(res => {
                                var fromNode = sidebarMenuItem.parent;
                                fromNode.items = fromNode.items.filter(x => x != sidebarMenuItem);
                                if (fromNode.items.length == 0) {
                                    fromNode.type = SidebarMenuItemType.simple;
                                    fromNode.active = false;
                                }
                                var toNode = result.sidebarMenuItem;
                                if (!toNode.items) toNode.items = [];
                                toNode.items.push(sidebarMenuItem);
                                toNode.type = SidebarMenuItemType.dropdown;
                                toNode.active = true;

                                // this.sidebarService.setSidebarMenuItems();
                            });
                        }
                    });
                }
            },
            {
                label: "حذف پوشه",
                icon: 'pi pi-times text-danger',
                command: () => {

                    var message = "آیا پوشه" + " " + folder.folderName + " " + "پاک شود؟";
                    if (confirm(message) == true) {
                        this.removeFolder(folder.id).subscribe(res => {
                            var parent = sidebarMenuItem.parent;

                            parent.items = parent.items.filter(x => x != sidebarMenuItem);

                            if (parent.items.length == 0) {
                                parent.type = SidebarMenuItemType.simple;
                                parent.active = false;
                            }

                            // this.sidebarService.setSidebarMenuItems();

                            //rout to parent
                        });
                    }

                    // this.confirmationService.confirm({
                    //     header: "حذف پوشه",
                    //     message: 'آیا این پوشه حذف شود؟',
                    //     acceptLabel: "بله",
                    //     rejectLabel: "خیر",

                    //     accept: () => {

                    //     }
                    // });
                }
            },
        ];
    }

    addSidebarMenuItem(folder: Folder, parent: SidebarMenuItem) {
        var sidebarMenuItem: SidebarMenuItem =
        {
            data: folder,
            lable: folder.folderName,
            type: SidebarMenuItemType.simple,
            icon: 'fa fa-folder text-info',
            activeIcon: 'fa fa-folder-open text-info',
            active: false,
            link: '/cartable/folder/' + folder.id,
            parent: parent
            // dataType: this.getFolderType(folder.folderName)
        }

        sidebarMenuItem.menuItems = this.getPersonalFolderMenuItems(sidebarMenuItem);

        if (!parent.items) parent.items = [];
        parent.items.push(sidebarMenuItem);
        parent.type = SidebarMenuItemType.dropdown;
        parent.active = true;

        // this.sidebarService.setSidebarMenuItems();

        //rout to new folder

    }

    setUserFolders() {
        this.getCurrentUserFolders().subscribe(folders => {
            // this.sidebarService.cartableSidebarMenuItem.items = this.getFoldersTree(folders);
            // this.sidebarService.setSidebarMenuItems();
        }, error => {
            console.error(error);
        });
    }

    getFoldersTree(folders: Folder[]): SidebarMenuItem[] {
        var sidebarMenuItems: SidebarMenuItem[] = folders.map(folder => this.folderToSidebarMenu(folder));

        sidebarMenuItems.forEach(node => {
            var folder: Folder = node.data;

            var children = sidebarMenuItems.filter(x => x.data.parentId == folder.id)

            if (children.length > 0) {
                children.forEach(x => x.parent = node);
                node.items = children;
                node.type = SidebarMenuItemType.dropdown;
            }
            else
                node.type = SidebarMenuItemType.simple;
        });

        return sidebarMenuItems.filter(x => x.data.parentId == null);
    }

    getCurrentFoldersTree(): TreeNode[] {
        return [];
        // var tree: TreeNode[] = this.getTreeNode(this.sidebarService.cartableSidebarMenuItem);
        // return tree;
    }

    getTreeNode(sidebarMenuItem: SidebarMenuItem): TreeNode[] {
        var tree: TreeNode[] = sidebarMenuItem.items.map(item => {
            var folder: Folder = item.data;
            return <TreeNode>{
                label: item.parent ? folder.folderName : "Cartable.Folders." + folder.folderName,
                data: { sidebarMenuItem: item, folder: folder },
                children: item.items ? this.getTreeNode(item) : null
            }
        });

        return tree;
    }

    folderToSidebarMenu(folder: Folder): SidebarMenuItem {

        var sidebarMenuItem: SidebarMenuItem =
        {
            data: folder,
            lable: 'empty',
            type: SidebarMenuItemType.dropdown,
            icon: 'fa fa-folder text-info',
            activeIcon: 'fa fa-folder-open text-info',
            active: false,
            visible: true
            // dataType: this.getFolderType(folder.folderName)
        }

        if (folder.parentId == null) {

            sidebarMenuItem.lable = 'cartable.folders.' + folder.folderName;
            sidebarMenuItem.link = '/cartable/' + folder.folderName;

            if (folder.folderName == 'personal')
                sidebarMenuItem.menuItems = this.getMainPersonalFolderMenuItems(sidebarMenuItem);
        }

        else {
            sidebarMenuItem.lable = folder.folderName;
            sidebarMenuItem.link = '/cartable/folder/' + folder.id;
            sidebarMenuItem.menuItems = this.getPersonalFolderMenuItems(sidebarMenuItem);
        }

        return sidebarMenuItem;
    }

    // getFolderType(folderName: string): FolderType {
    //     switch (folderName) {
    //         case 'inbox': return FolderType.inbox;
    //         case 'sent': return FolderType.sent;
    //         case 'archive': return FolderType.archive;
    //         case 'trash': return FolderType.trash;
    //         default: return FolderType.personal;
    //     }
    // }


    getCurrentUserFolders(): Observable<Folder[]> {
        var url = this.apiUrl + "/services/cartable/api/folders/current-user-folders";
        return this.http.get<Folder[]>(url);
    }

    moveActivity(input: ActivityMove): Observable<void> {
        var url = this.apiUrl + "/services/cartable/api/folders/activityMove";
        return this.http.post<void>(url, input);
    }

    trashActivity(input: ActivityTrash): Observable<void> {
        var url = this.apiUrl + "/services/cartable/api/folders/activityTrash";
        return this.http.post<void>(url, input);
    }

    archiveActivity(input: ActivityArchive): Observable<void> {
        var url = this.apiUrl + "/services/cartable/api/folders/activityArchive";
        return this.http.post<void>(url, input);
    }

    restoreActivity(input: ActivityRestore): Observable<void> {
        var url = this.apiUrl + "/services/cartable/api/folders/activityRestore";
        return this.http.post<void>(url, input);
    }

    newFolder(input: FolderNew): Observable<Folder> {
        var url = this.apiUrl + "/services/cartable/api/new-folder";
        return this.http.post<Folder>(url, input);
    }

    renameFolder(input: FolderRename): Observable<Folder> {
        var url = this.apiUrl + "/services/cartable/api/folders/rename";
        return this.http.post<Folder>(url, input);
    }

    moveFolder(input: FolderMove): Observable<Folder> {
        var url = this.apiUrl + "/services/cartable/api/folders/move";
        return this.http.post<Folder>(url, input);
    }

    removeFolder(id: number): Observable<void> {
        var url = this.apiUrl + "/services/cartable/api/folders/" + id;
        return this.http.delete<void>(url);
    }
}