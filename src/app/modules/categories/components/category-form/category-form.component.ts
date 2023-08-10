import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CategoryEvent } from 'src/app/models/enums/categories/CategoryEvent.enum';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: []
})
export class CategoryFormComponent implements OnInit, OnDestroy{

  private readonly destroy$: Subject<void> = new Subject();
  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;
  public categoryAction!: {event: EditCategoryAction};

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    private fb: FormBuilder,
    private msg: MessageService,
    private categoriesService: CategoriesService
  ){}

  public categoryForm = this.fb.group({
    name: ['', Validators.required]
  })

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  handleSubmitAddCategory():void{
    if(this.categoryForm?.value && this.categoryForm?.valid){
      const requestCreateCategory: {name: string} = {
        name: this.categoryForm.value.name as string,
      }
      this.categoriesService.createNewCategory(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.categoryForm.reset();
            if(response){
              this.msg.add({
                severity: 'success',
                 summary: 'Sucesso',
                 detail: 'Categoria Criada com sucesso!',
                 life: 3000,
              })
            }
          },
          error: (err: HttpErrorResponse) => {
            this.categoryForm.reset();
            this.msg.add({
              severity: 'error',
               summary: 'Erro',
               detail: 'Erro a criar categoria!',
               life: 3000,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
