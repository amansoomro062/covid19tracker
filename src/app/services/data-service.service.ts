import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { GlobalDataSummary } from '../models/global-data';
import { DateWiseData } from '../models/date-wise-data';
import { error } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  
  private baseURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';
  private globalDataUrl2 = ''
  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/05-20-2020.csv';
  private dateWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

  private extension = '.csv';
  month;
  date;
  year;
  

  getDate(date: number) {
    if(date < 10) {
      return '0'+date;
    }
    return date;
  }
  constructor(private http: HttpClient) {

    let now = new Date()
    this.month = now.getMonth() + 1;
    this.year = now.getFullYear()
    this.date = now.getDate()

    this.globalDataUrl2 = `${this.baseURL}${this.getDate(this.month)}-${this.getDate(this.date)}-${this.year}${this.extension}`;
    console.log(this.globalDataUrl2);
    
    
   }

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, {responseType: 'text'})
    .pipe(map(result => {
        
        let rows = result.split('\n')
//        console.log(rows);
        let mainData = {}
        let header = rows[0]
        let dates = header.split(/,(?=\S)/)
        dates.splice(0 , 4)
        //console.log(dates);
        rows.splice(0,1)
        
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)
          let con = cols[1];
          cols.splice(0, 4);
          mainData[con] = []
          cols.forEach((value,index)=> {
            let dw : DateWiseData = {
              cases : +value,
              country : con,
              date: new Date(Date.parse(dates[index]))
            }
            mainData[con].push(dw)
          })
           
        })
        
        
        
        //console.log(mainData);
        
        return mainData;
      })
    )
  }



  getGlobalData() {
    return this.http.get(this.globalDataUrl2, {responseType: 'text'}).pipe(
      map(result => {
        let data : GlobalDataSummary[] = [];
        let raw = {}
        let rows = result.split('\n')
        rows.splice(0,1)
        //console.log(rows)
        rows.forEach(row=>{
          let cols = row.split(/,(?=\S)/)
          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          };

          let temp: GlobalDataSummary = raw[cs.country]

          if(temp) {
              temp.active = temp.active + cs.active;
              temp.confirmed = temp.confirmed + cs.confirmed;
              temp.deaths = temp.deaths + cs.deaths;
              temp.recovered = temp.recovered + cs.recovered;
              
              raw[cs.country] = temp;
        
            } else {
              raw[cs.country] = cs;
            }
           

          //data.push()
        })
        return <GlobalDataSummary[]>Object.values(raw)  
      }),
      catchError((error:HttpErrorResponse)=> {
        if(error.status == 404) {
          this.date = this.date-1;
          this.globalDataUrl2 = `${this.baseURL}${this.getDate(this.month)}-${this.getDate(this.date)}-${this.year}${this.extension}`;
          console.log(this.globalDataUrl2);
          return this.getGlobalData()
          //return []
        }
      })
    )
  }
}
