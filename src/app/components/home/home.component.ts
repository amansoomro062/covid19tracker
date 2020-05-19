import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { CssSelector } from '@angular/compiler';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  }
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  }
  constructor(private dataService: DataServiceService) { }


  initChart() {

    let dataTable = []
    dataTable.push(["Country","Cases"])
    this.globalData.forEach(cs=>{

      if(cs.confirmed >= 25000) {
        dataTable.push([
          cs.country,
          cs.confirmed
        ])
      }
    })

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        //'Country': 'Cases'
        height: 500
      },
    };

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        //'Country': 'Cases'
        height: 500
      },
    };
  }
  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next:  (result)=> {
          
          this.globalData = result
          result.forEach(cs=>{
            if(!Number.isNaN(cs.confirmed)) {
              this.totalConfirmed += cs.confirmed;
              this.totalActive += cs.active;
              this.totalDeaths += cs.deaths;
              this.totalRecovered += cs.recovered
            }
          })

          this.initChart()
        }
      }
    )
  }

}
