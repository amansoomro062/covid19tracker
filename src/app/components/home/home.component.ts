import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { CssSelector } from '@angular/compiler';
import { GlobalDataSummary } from 'src/app/models/global-data';

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
  loading = true;
  globalData: GlobalDataSummary[];
  dataTable = []
  
  chart = {
    PieChart: "PieChart",
    ColumnChart: "ColumnChart",
    height: 500,
    options: {
      animation: {
        duration:1000,
        easing: 'out',
      }
    }
    
  }
 
  constructor(private dataService: DataServiceService) { }


  updateChart(input: HTMLInputElement) {
    
    this.initChart(input.value)
  }

  initChart(caseType: string) {

   
    this.dataTable = []
    //this.dataTable.push(["Country","Cases"])
    
    this.globalData.forEach(cs=>{

      let value: number;
      
      if(caseType == 'c')
        if(cs.confirmed >= 2000)
          value = cs.confirmed
      
      if(caseType == 'd')
          if(cs.deaths >= 2000)
            value = cs.deaths
            
      if(caseType == 'r')
            if(cs.recovered >= 2000)
              value = cs.recovered
              
      if(caseType == 'a')
              if(cs.active >= 2000)
                value = cs.active

      this.dataTable.push([
        cs.country,
        value
      ])  
      
      //console.log(this.dataTable);
      
    })

    
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

          this.initChart('c')
        },
        complete: () => {
          this.loading = false; 
        }
      }
    )
  }

}
