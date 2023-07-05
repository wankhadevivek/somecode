import { Component, OnInit, ViewChild } from '@angular/core';
import { UserserviceService } from 'src/app/services/userservice.service';
import { ChartDataSets, ChartOptions,ChartType } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip,Color } from 'ng2-charts';
import { SpinnerService } from '../../services/spinner.service';
import { GeneralService } from '../../services/general.service';
import { MatSnackBar } from '@angular/material';
import  {ErrorMessgae}  from  '../../shared/error_message/error';
import * as moment from 'moment';
import * as _ from 'lodash';
import { type } from 'os';
import * as pluginLabels from 'chartjs-plugin-labels';
import { combineAll } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
/**
 * In this compoenet dashboard data
 * all the grapgs are shown
 * Highlight charts  libraray is
 * used here to show graphs
*/
export class DashbordComponent implements OnInit {
  date=new Date();
  Fordate=new Date();
  Fordatenew=new Date();
  remunepercen=0
  paidpercen=0
  pendingpercen=0
  showpaidincrease:boolean=false
  showpenindgincrease:boolean=false
  activecalssweek="btn btn-xs btn-white active";
  activeclassmonth='btn btn-xs btn-white';
  activeclasssix="btn btn-xs btn-white";
  gsDayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  totalRevenue='0.0'
  totalPurchase='0.0'
  totalpending='0.0' 
  Highcharts = Highcharts;
  barChartOptionss={   
    chart: {
      type: 'column'
  },
  title: {
      text: 'Revenue'
  },
  subtitle: {
      text: ''
  },
  xAxis: {
      categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
      ],
      crosshair: true
  },
  yAxis: {
      min: 0,
      title: {
          text: ''
      }
  },
  tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
  },
  plotOptions: {
      column: {
          pointPadding: 0.2,
          borderWidth: 0
      }
  },
  credits: {
    enabled: false
  },
  labels: {
      items: [{
          html: 'Jobs, Spare & Lube Revenue',
          style: {
              left: '50px',
              top: '18px',
              color: ( // theme
                  Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color
              ) || 'black'
          }
      }]
  },
  series: [{
      name: 'Tokyo',
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

  }, {
      name: 'New York',
      data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

  }, {
      name: 'London',
      data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

  }, {
      name: 'Berlin',
      data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

  }],
  exporting: {
    enabled: false
  }
  };
  barChartOptionsClosed={   
    title: {
      text: 'Closed Jobcard'
    },
    
		tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: ['Jan']
    },
    credits: {
      enabled: false
    },
    
  series: [{
      type: 'column',
      colorByPoint: true,
      data: [29.9],
      showInLegend: false,
      
  }],
  exporting: {
    enabled: false
  }
  };
  chartOptions =  {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Vehicle(Make Wise)'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        },
        showInLegend: true
      }
    },
    exporting: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Brands',
      colorByPoint: true,
      data: [{name: 'No Data',y: 100,sliced: true,selected: true}]
    }]
  };
  public pieChartOptions:ChartOptions=
    {
      responsive: true,
      legend: { position: 'bottom' },
        maintainAspectRatio: true,
        plugins: {
            labels: 
            {
              render: 'percentage',
              fontColor: ["#c30707","#c30707","#c30707","#c30707","#c30707","#c30707"
            ,"#c30707","#c30707","#c30707","#c30707","#c30707","#c30707","#c30707","#c30707"
          ,"#c30707","#c30707","#c30707","#c30707","#c30707","#c30707","#c30707","#c30707"
        ,"#c30707","#c30707","#c30707","#c30707","#c30707","#c30707","#c30707","#c30707"],
              precision: 2,
            }
        },
  }
  public pieChartLabels: Label[] = Array();
  public pieChartData: SingleDataSet = []
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins =[];
  lineChartData= Array()
  lineChartLabels=Array()
  showbarchart:boolean=false
  linearr=Array()
  lineChartOptions = {
    responsive: true,
    legend: { position: 'bottom' } 
  };
  barChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'bottom' },
  };
  lineChartColors: Color[] = Array()
  barChartColors: Color[] = Array();
  pieChartColors: Color[] = Array()
  lineChartLegend = true;
  lineChartPlugins = [];
  barChartLabels: Label[] = Array()
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [];
  clodesJobcardData=Array()
  LubesData=Array()
  argaecount=Array()
  pieofinvenoflube=Array()
  pieofinvenofjob=Array()
  pieofinvenofspare=Array()
  SparesData=Array()
  JobsData=Array()
  barChartData= Array()
  constructor(private showspinner:SpinnerService,
    private userservice:UserserviceService,
    public generalservice:GeneralService,
    private snakBar:MatSnackBar) { 
      monkeyPatchChartJsTooltip();
      monkeyPatchChartJsLegend();
  }
  // weekly chart graph is shown on first load
  ngOnInit() {
    this.dayCalculate('weekly')
  }
  // days per week monthly are calculated
  dayCalculate(days){
    if(days=="weekly"){
      this.activeclassmonth="btn btn-xs btn-white"
      this.activeclasssix="btn btn-xs btn-white"
      this.activecalssweek="btn btn-xs btn-white active"
      this.lineChartLabels=[]
      this.linearr=[]
      this.pieChartData=[]
      this.pieChartLabels=[]
      this.barChartData=[]
      this.lineChartData=[]
      var weekday=new Array(7);
      weekday[0]="Sunday";
      weekday[1]="Monday";
      weekday[2]="Tuesday";
      weekday[3]="Wednesday";
      weekday[4]="Thursday";
      weekday[5]="Friday";
      weekday[6]="Saturday";
      
        var dateaddbefore=this.date.toString().substring(0,10).split(" ")
        
        this.lineChartLabels.push(dateaddbefore[2]+dateaddbefore[1]+"("+dateaddbefore[0]+")")
        this.linearr.push(dateaddbefore[0])

        
        var dateaddbeforedate=moment().subtract(1, 'days')["_d"].toString().substring(0,10).split(" ")
        
        this.lineChartLabels.push(dateaddbeforedate[2]+dateaddbeforedate[1]+"("+dateaddbeforedate[0]+")")
        this.linearr.push(dateaddbeforedate[0])


     
        var dateaddbeforetwo=moment().subtract(2, 'days')["_d"].toString().substring(0,10).split(" ")
        
        this.lineChartLabels.push(dateaddbeforetwo[2]+dateaddbeforetwo[1]+"("+dateaddbeforetwo[0]+")")
        this.linearr.push(dateaddbeforetwo[0])

        var dateaddbeforedatethree=moment().subtract(3, 'days')["_d"].toString().substring(0,10).split(" ")
       
        this.lineChartLabels.push(dateaddbeforedatethree[2]+dateaddbeforedatethree[1]+"("+dateaddbeforedatethree[0]+")")
        this.linearr.push(dateaddbeforedatethree[0])



        var dateaddbeforefour=moment().subtract(4, 'days')["_d"].toString().substring(0,10).split(" ")
       
        this.lineChartLabels.push(dateaddbeforefour[2]+dateaddbeforefour[1]+"("+dateaddbeforefour[0]+")")
        this.linearr.push(dateaddbeforefour[0])

        var dateaddbeforedatefive=moment().subtract(5, 'days')["_d"].toString().substring(0,10).split(" ")
        
        this.lineChartLabels.push(dateaddbeforedatefive[2]+dateaddbeforedatefive[1]+"("+dateaddbeforedatefive[0]+")")
        this.linearr.push(dateaddbeforedatefive[0])


        var dateaddbeforedatesix=moment().subtract(6, 'days')["_d"].toString().substring(0,10).split(" ")
        this.lineChartLabels.push(dateaddbeforedatesix[2]+dateaddbeforedatesix[1]+"("+dateaddbeforedatesix[0]+")")
        this.linearr.push(dateaddbeforedatesix[0])
        this.lineChartLabels.reverse()
        this.linearr.reverse()
      
      
      this.getDasgboardData('week')
    }else if(days=="monthly"){
      this.Fordate=new Date();
      this.Fordatenew=new Date();
      this.lineChartLabels=[]
      this.linearr=[]
      this.pieChartData=[]
      this.pieChartLabels=[]
      this.barChartData=[]
      this.lineChartData=[]
      this.activeclassmonth="btn btn-xs btn-white active"
      this.activeclasssix="btn btn-xs btn-white"
      this.activecalssweek="btn btn-xs btn-white"
      var firstOfMonth = new Date(this.Fordate.getFullYear(), this.Fordate.getMonth(), this.Fordate.getDay());
      var lastOfMonth = new Date(this.Fordate.getFullYear(), this.Fordate.getMonth()+1, this.Fordate.getDay());
      var calculateweeks=Math.round((Math.floor((lastOfMonth.getTime() - firstOfMonth.getTime())/(1000*60*60*24)))/7)  
      
      if(calculateweeks==4){
        
        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
        )
        
        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()+1)).toString().substring(0,13)
        )



        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()-13)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
         
        )


        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()-6)).toString().substring(0,13)
         
        )


        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()-13)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
        )
        
        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()-6)).toString().substring(0,13)
         
        )


        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()-13)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
        )
        

        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()-6)).toString().substring(0,13)
         
        )

        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()-13)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
        )

        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()-6)).toString().substring(0,13)
          
        )
        this.linearr.reverse();
        this.lineChartLabels.reverse();
        
      }else{
        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
        )
        
        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()+1)).toString().substring(0,13)
        )



        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()-13)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
         
        )


        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()-6)).toString().substring(0,13)
         
        )


        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()-13)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
        )
        
        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()-6)).toString().substring(0,13)
         
        )


        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()-13)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
        )
        

        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()-6)).toString().substring(0,13)
         
        )

        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()-13)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
        )

        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()-6)).toString().substring(0,13)
          
        )

        this.lineChartLabels.push( 
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()-13)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]
          +"-"+
          new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+7)).toString().substring(0,13).split(" ")[2]+new Date(this.Fordate.setDate(this.Fordate.getDate() - this.Fordate.getDay()+1)).toString().substring(0,13).split(" ")[1]+" "+
          this.Fordate.getFullYear().toString().slice(-2)
        )

        this.linearr.push( 
          new Date(this.Fordatenew.setDate(this.Fordatenew.getDate() - this.Fordatenew.getDay()-6)).toString().substring(0,13)
          
        )

        this.lineChartLabels.reverse();
        this.linearr.reverse();
      }
      
      this.getDasgboardData('month')
    }else if(days=="sixMonths"){
      this.lineChartLabels=[]
      this.linearr=[]
      this.pieChartLabels=[]
      this.pieChartData=[]
      this.barChartData=[]
      this.lineChartData=[]
      this.activeclassmonth="btn btn-xs btn-white"
      this.activeclasssix="btn btn-xs btn-white active"
      this.activecalssweek="btn btn-xs btn-white"
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var d;
      var month;

      for(var i = 6; i > 0; i -= 1) {
        d = new Date(this.date.getFullYear(), this.date.getMonth()+1 - i, 1);
        var year=d.getFullYear().toString().substr(d.getFullYear().toString().length - 2)
        month = monthNames[d.getMonth()];
        this.lineChartLabels.push(month+"("+year+")")
        this.linearr.push(month)
      }
      this.getDasgboardData('six')
    }
  }
  //API call for dashboard
  getDasgboardData(mode){
    this.generalservice.getGraphData(this.userservice.getData()["workshop_id"],mode).subscribe(graphData=>{
      this.showspinner.setSpinner(true)
      if(graphData.success==true){
        
        var showarr:any
        showarr=graphData.inventory
        var groups
        var groupArrays
        if(mode=='month'){
          var montharr
          montharr = _.groupBy(showarr, (result) => moment(result['closed_date'].split(' ')[0], 'YYYY-MM-DD').startOf('isoWeek'));
          
          var newarr=Array()
          var inven_arr=Array()
          var labelarr=Array()
          var vehiclearr=Array()
          Object.keys(montharr).forEach(key => {
              montharr[key].map(data=>{
                inven_arr.push(
                  {
                    "jobcard_status":data.jobcard_status,
                    "jobcard_number":data.jobcard_number,
                    "jobcard_lubes_items":JSON.parse(data.jobcard_lubes_items),
                    "jobcard_spare_items":JSON.parse(data.jobcard_spare_items),
                    "jobcard_job_items":JSON.parse(data.jobcard_job_items),
                  }
                )
                if(JSON.parse(data.vehicle_details).make==undefined){
                  vehiclearr.push(JSON.parse(data.vehicle_details).vehicle_make)
                }else{
                  vehiclearr.push(JSON.parse(data.vehicle_details).make)
                }
              })
              newarr.push({
                [key.toString().substring(0,13)]: inven_arr
              })
              labelarr.push(key.toString().substring(0,13))
              inven_arr=[]
          })
          this.calculateallcaluions(vehiclearr,labelarr,newarr)
        }
        else if(mode=='six'){
            var montharrnew
            montharrnew = _.groupBy(showarr, (b) =>
            moment(b.closed_date.split(' ')[0]).startOf('month').format('YYYY-MM-DD'));
            
          _.values(montharrnew)
            .forEach(arr => arr.sort((a, b) => moment(a.closed_date.split(' ')[0]).day() - moment(b.closed_date.split(' ')[0]).day()));

            var newarrnew=Array()
            var labelarr=Array() 
            var vehiclearr=Array()
            var inven_arr_new=Array()
            Object.keys(montharrnew).forEach(key => {
               
                montharrnew[key].map(data=>{
                  inven_arr_new.push(
                    {
                      "jobcard_status":data.jobcard_status,
                      "jobcard_number":data.jobcard_number,
                      "jobcard_lubes_items":JSON.parse(data.jobcard_lubes_items),
                      "jobcard_spare_items":JSON.parse(data.jobcard_spare_items),
                      "jobcard_job_items":JSON.parse(data.jobcard_job_items),
                    }
                  )
                  if(JSON.parse(data.vehicle_details).make==undefined){
                    vehiclearr.push(JSON.parse(data.vehicle_details).vehicle_make)
                  }else{
                    vehiclearr.push(JSON.parse(data.vehicle_details).make)
                  }
                })
                newarrnew.push({
                  [new Date(key).toLocaleString('default', { month: 'short' })]: inven_arr_new
                })
                labelarr.push(new Date(key).toLocaleString('default', { month: 'short' }))
                inven_arr_new=[]
            })
            this.calculateallcaluions(vehiclearr,labelarr,newarrnew)
        }
        else if(mode=='week'){
          var vehiclearr=Array()
          var labelarr=Array()
           groups = showarr.reduce((groups, jobacrds) => {
            const date = jobacrds.closed_date.split(' ')[0];
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push({
              "jobcard_status":jobacrds.jobcard_status,
              "jobcard_number":jobacrds.jobcard_number,
              "jobcard_lubes_items":JSON.parse(jobacrds.jobcard_lubes_items),
              "jobcard_spare_items":JSON.parse(jobacrds.jobcard_spare_items),
              "jobcard_job_items":JSON.parse(jobacrds.jobcard_job_items),
            });
            if(JSON.parse(jobacrds.vehicle_details).make==undefined){
              vehiclearr.push(JSON.parse(jobacrds.vehicle_details).vehicle_make)
            }else{
              vehiclearr.push(JSON.parse(jobacrds.vehicle_details).make)
            }
            return groups;
          }, {});
          groupArrays = Object.keys(groups).map((date) => {
              var myDate = new Date(date);
              var dayName = this.gsDayNames[myDate.getDay()].toString().substring(0,3);
              labelarr.push(dayName)
            return {
              [dayName]: groups[date]
            };
          });
          this.calculateallcaluions(vehiclearr,labelarr,groupArrays)
        }
        if(graphData.finalamountpaid!=null){
          this.totalRevenue=Math.round(graphData.finalamountpaid).toLocaleString()
        }else{
          this.totalRevenue='0'
        }
        if(graphData.finalamountpurchase!=null){
          this.totalPurchase=Math.round(graphData.finalamountpurchase).toLocaleString()
        }else{
          this.totalPurchase='0'
        }
        if(graphData.finalamountpending!=null){
          this.totalpending=Math.round(graphData.finalamountpending).toLocaleString()
        }else{
          this.totalpending='0'
        }
        
        
        
        
        if(graphData.finalamountpaidprevious==null&& graphData.finalamountpaidprevious==undefined){
          graphData.finalamountpaidprevious=0
        }else{
          graphData.finalamountpaidprevious=graphData.finalamountpaidprevious
        }
        var revenueolddata=graphData.finalamountpaid-graphData.finalamountpaidprevious
        this.remunepercen=parseFloat(((revenueolddata / graphData.finalamountpaid)* 100).toFixed(2))
        
        // this.pendingpercen=parseFloat((100 * (graphData.finalamountpendingprevious/graphData.finalamountpending)).toFixed(2))
        // this.paidpercen=parseFloat((100 * (graphData.finalamountpurchaseprevious/graphData.finalamountpurchase)).toFixed(2))
        var pendingpercenolddata=graphData.finalamountpending-graphData.finalamountpendingprevious
        this.pendingpercen=parseFloat(((pendingpercenolddata / graphData.finalamountpending)* 100).toFixed(2))
        var paidpercenolddata=graphData.finalamountpurchase-graphData.finalamountpurchaseprevious
        this.paidpercen=parseFloat(((paidpercenolddata / graphData.finalamountpurchase)* 100).toFixed(2))
        
        
        
        
        if(this.remunepercen>=0){
          this.remunepercen=this.remunepercen
        }else{
          this.remunepercen=0
        }

        if(this.pendingpercen>=0){
          this.pendingpercen=this.pendingpercen
        }else{
          this.pendingpercen=0
        }

        if(this.paidpercen>=0){
          this.paidpercen=this.paidpercen
        }else{
          this.paidpercen=0
        }

        if(graphData.finalamountpendingprevious>=graphData.finalamountpending){
          this.showpenindgincrease=false
        }else{
          this.showpenindgincrease=true
        }



        if(graphData.finalamountpurchaseprevious<=graphData.finalamountpurchase){
          this.showpaidincrease=true
        }else{
          this.showpaidincrease=false
        }
        this.showspinner.setSpinner(false)
      }else{
        this.showspinner.setSpinner(false)
      }
    },err=>{
      this.showspinner.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  // calcultionsra are done
  calculateallcaluions(vehiclearr,labelarr,newarrnew){
    var counts = {};
    this.clodesJobcardData=[]
    this.LubesData=[]
    this.SparesData=[]
    this.argaecount=[]
    this.pieofinvenofjob=[]
    this.pieofinvenoflube=[]
    this.pieofinvenofspare=[]
    this.JobsData=[]
    this.showbarchart=true
    var countnew = {};
    vehiclearr.forEach(number => countnew[number] = (countnew[number] || 0) +1);
    var pielabel=Array()
    Object.keys(countnew).forEach(Number => {
      // pielabel.push(Number+": "+countnew[Number])
      pielabel.push({
        name:Number,y:countnew[Number]
      })
    });
    var pipdata=Array()
    this.pieChartLabels=pielabel
    pipdata=Object.values(countnew)
    this.pieChartData=pipdata
    this.linearr.map(label=>{
      if(labelarr.includes(label)){
        newarrnew.map(monthdata=>{
          if(monthdata[label]!=undefined){
            var count = 0;
            var lubecount=0;
            var sparecount=0;
            var jobcount=0;
            var averagecount=0
            monthdata[label].map(newdata=>{
              if(newdata.jobcard_status=='2'){
                count++
              }
              newdata.jobcard_lubes_items.map(lubedata=>{
                if(typeof(lubedata.amount)=='string'){
                  lubecount=lubecount+parseInt(lubedata.amount)
                }else{
                  lubecount=lubecount+lubedata.amount
                }
              })
              newdata.jobcard_spare_items.map(lubedata=>{
                if(typeof(lubedata.amount)=='string'){
                  sparecount=sparecount+parseInt(lubedata.amount)
                }else{
                  sparecount=sparecount+lubedata.amount
                }
              })
              newdata.jobcard_job_items.map(lubedata=>{
                if(typeof(lubedata.amount)=='string'){
                  jobcount=jobcount+parseInt(lubedata.amount)
                }else{
                  jobcount=jobcount+lubedata.amount
                }
              })
            })
            this.argaecount.push(lubecount+sparecount+jobcount)
            this.LubesData.push(lubecount)
            this.SparesData.push(sparecount)
            this.JobsData.push(jobcount)
            this.clodesJobcardData.push(count)
          }
        })
      }
      else{
        this.argaecount.push(0+0+0)
        this.clodesJobcardData.push(0)
        this.LubesData.push(0)
        this.SparesData.push(0)
        this.JobsData.push(0)
      }
    })
    // this.barChartData.push(this.clodesJobcardData)
    this.barChartColors.push({
        borderColor: 'none',
        backgroundColor: '#52D726',
    })
    this.pieofinvenofjob=this.JobsData.reduce((a, b) => a + b, 0)
    this.pieofinvenoflube=this.LubesData.reduce((a, b) => a + b, 0)
    this.pieofinvenofspare=this.SparesData.reduce((a, b) => a + b, 0)
    this.lineChartData.push(
      { data: this.SparesData, name: 'Spares' },
      { data: this.LubesData, name: 'Lubes' },
      { data: this.JobsData, name: 'Jobs' }, {
          type: 'spline',
          name: 'Revenue',
          data: this.argaecount,
          marker: {
              lineWidth: 2,
              lineColor: Highcharts.getOptions().colors[3],
              fillColor: 'white'
          }
      }, {
        type: 'pie',
        name: 'Jobs, Spare & Lube Revenue',
        data: [{
            name: 'Spare',
            y: this.pieofinvenofspare,
            color: Highcharts.getOptions().colors[0] // Jane's color
        }, {
            name: 'Lube',
            y: this.pieofinvenoflube,
            color: Highcharts.getOptions().colors[1] // John's color
        }, {
            name: 'Jobs',
            y: this.pieofinvenofjob,
            color: Highcharts.getOptions().colors[2] // Joe's color
        }],
        center: [100, 80],
        size: 100,
        showInLegend: false,
        dataLabels: {
            enabled: false
        }
      }
    )
    
    this.lineChartColors.push({
        borderColor: 'none',
        backgroundColor: '#FF0000',
      },
      {
        borderColor: 'none',
        backgroundColor: '#007ED6',
      },
      {
      borderColor: 'none',
      backgroundColor: '#FF7300',
    })
    this.showbarchart

    
    this.pieChartColors.push(
      {
        borderColor: 'none',
        backgroundColor: ['#52d726','#ffec00','#ff7300','#ff0000','#007ed6','#7cdddd','#d84315','#ff8f00','#311b92','#b3c100','#000000','#202020','#ac3e31','#7e909a','#1c4e80','#dbae58','#ea6a47','#6ab187','#488a99','#ff7f0e'],
      },
    )
    
    this.barChartOptionss={   
      chart: {
        type: 'column'
    },
    title: {
        text: 'Revenue '
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: this.lineChartLabels,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Amount(₹)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} ₹</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    credits: {
      enabled: false
    },
    labels: {
        items: [{
            html: 'Jobs, Spare & Lube Revenue',
            style: {
                left: '50px',
                top: '18px',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'black'
            }
        }]
    },
    series: this.lineChartData,
    exporting: {
      enabled: false
    }
   };
   this.barChartOptionsClosed={   
    title: {
      text: 'Closed Jobcards'
      },
      tooltip: {
        pointFormat: 'Closed Jobcard: <b>{point.y}</b>'
      },
      subtitle: {
          text: ''
      },
      xAxis: {
          categories: this.lineChartLabels
      },
      credits: {
        enabled: false
      },
      series: [{
          type: 'column',
          colorByPoint: true,
          data: this.clodesJobcardData,
          showInLegend: false,
          
      }],
      exporting: {
        enabled: false
      }
    };
   
    this.pieChartPlugins = [pluginLabels];
      if(pielabel.length!=0){
        pielabel[0]["sliced"]=true
        pielabel[0]["selected"]=true
      }else{
        pielabel=[{name: 'No Data',y: 100,sliced: true,selected: true}]
      }
      
    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Vehicle(Make Wise)'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
          showInLegend: true
        }
      },
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      
      series: [{
        name: 'Brands',
        colorByPoint: true,
        data: pielabel,
        
      }]
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);


  } 
}
