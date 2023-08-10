import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/event/DeleteCategoryAction';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: []
})
export class CategoriesHomeComponent implements OnInit,  OnDestroy{


  private readonly destroy$: Subject<void> = new Subject();
  public categoryDatas: GetCategoriesResponse[] = [];
  private ref!: DynamicDialogRef;

  constructor(
    private catService: CategoriesService,
    private dialogService: DialogService,
    private msg: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ){}



  ngOnInit(): void {
    this.getAllCategories()
  }

  getAllCategories() {
    this.catService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.length > 0){
            this.categoryDatas = response;
          }
        },
        error: (err: HttpErrorResponse) => {
          this.msg.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao buscar categorias: ${err.error}`,
            life: 3000
          });
          this.router.navigate(['/dashboard'])
          }
      })
  }

  handleDeletecategoryAction(event: DeleteCategoryAction): void{
    if(event){
      this.confirmationService.confirm({
        header: 'Confirmação de exclusão',
        message: `Confirma a exclusão da Categoria: ${event?.categoryName}`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () =>this.deleteCategory(event?.category_id)
      })
    }
  }

  handleCategoryAction(event: EditCategoryAction) {
    if(event){
      this.ref = this.dialogService.open(CategoryFormComponent, {
        header: event.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
         data: {
          event: event,
         }
      });
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAllCategories()
      });
    }
    }

  deleteCategory(category_id: string): void {
    if(category_id){
      this.catService.deleteCategory({category_id})
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (err: HttpErrorResponse)=>{
            this.msg.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao Deletar a categoria ${err.name}: ${err.message}`,
              life: 3000
            });
            this.getAllCategories();
          },
          complete: () =>{
            this.getAllCategories();
            this.msg.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Categoria excluida com sucesso!}`,
              life: 3000
            });
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
