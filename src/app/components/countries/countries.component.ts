import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/date-wise-data';


import { merge } from 'rxjs';
import {map} from 'rxjs/operators'

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  data;
  //data: GlobalDataSummary[]
  countries: string[] = []
  dataTable = [];
  dateWiseData;
  selectedCountryData: DateWiseData[];
  loading = true;

  chart = {
    LineChart: "LineChart",
    height: 500,
    options: {
      animation: {
        duration:1000,
        easing: 'out',
      },
    }
    
  }
 

 
  type = 'LineChart';
  width = 550;
  height = 400;
  curDate=new Date();
  
  data2 = []

  updateChart() {

    this.dataTable.push(["Date" , 'Cases'])
    
    //console.log(this.selectedCountryData+"updateChart")
    this.data2 = []
    this.selectedCountryData.forEach(cs=> {
      this.data2.push([cs.cases, cs.date])
    })

    //console.log(this.dataTable);
    //console.log(this.data2);
    
    


  }

  constructor(private dataService : DataServiceService) { }
  
  ngOnInit(): void {


    merge(
      this.dataService.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        }),
      ),
      this.dataService.getGlobalData().pipe(
        map(result => {

          
          this.data = result;
          
          this.data.forEach(cs=>{
            this.countries.push(cs.country)
          })
        })
      )
    ).subscribe(
      {
        complete: ()=> {
          this.onChange('US')
          this.loading = false
        }
      }
    )

    
  }

  onChange(country: string) {
    //console.log(country);
    this.data.forEach(cs=>{
      if(cs.country == country) {
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths= cs.deaths;
        this.totalRecovered= cs.recovered;
      }
    })

    this.selectedCountryData = this.dateWiseData[country]
    this.updateChart()
    //console.log(this.selectedCountryData);
    
  }

}
