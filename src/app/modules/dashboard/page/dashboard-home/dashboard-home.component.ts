import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();
  public productList: GetAllProductsResponse[] = [];

  public productChartDatas!: ChartData;
  public productChartOptions!: ChartOptions;

  constructor(
    private productsService: ProductsService,
    private msg: MessageService,
    private prodDtService: ProductsDataTransferService
  ){}


  ngOnInit(): void {
    this.getProductsData();
  }


  getProductsData(): void {
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.productList = response;
          this.prodDtService.setProductDatas(this.productList)
          this.setProductsChartConfig();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.msg.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao buscar produtos: ${err.error}`,
          life: 3000
        });
      }

    })
  }

  setProductsChartConfig(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

    this.productChartDatas = {
      labels: this.productList.map((element)=> element?.name),
      datasets: [
        {
          label: 'Quantidade',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: this.productList.map((element) => element?.amount),
        }
      ]
    }

    this.productChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: { ticks:{
            color: textColorSecondary,
            font:{
              weight: '500',
            },
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {color: textColorSecondary},
          grid: {color: surfaceBorder}
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
