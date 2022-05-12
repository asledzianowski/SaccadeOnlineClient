import { Injectable, ElementRef } from '@angular/core';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class DataCollectorService
{

  private uncompletedCalibrationRequests:Array<any> = [];
  public get UncompletedCalibrationRequests(): Array<any> {return this.uncompletedCalibrationRequests};
  private calibrationData:Array<any> = [];
  public get CalibrationData(): Array<any> {return this.calibrationData};

  private uncompletedExperimentRequests:Array<any> = [];
  public get UncompletedExperimentRequests(): Array<any> {return this.uncompletedExperimentRequests}
  private experimentData:Array<any> = [];
  public get ExperimentData(): Array<any> {return this.experimentData};

  public formData: object;

  constructor(private dataService: DataService) {}

  public proceedCalibrationFrame(timeStamp: number, base64Image : string, currentState: number)
  {
    this.uncompletedCalibrationRequests.push(timeStamp);
    this.dataService.postGazeData(base64Image).subscribe((data: any[])=>{

      var dataItem = { "time": timeStamp, "gaze_x": data['gaze_x'],"gaze_y": data['gaze_y'],
      "marker": currentState, "state" : currentState};

      this.calibrationData.push(dataItem);
      this.removeValueFromArray(this.uncompletedCalibrationRequests, timeStamp);

    });
  }

  public proceedExperimentFrame(timeStamp: number, base64Image : string, currentState: number)
  {
    this.uncompletedExperimentRequests.push(timeStamp);
    this.dataService.postGazeData(base64Image).subscribe((data: any[])=>{

      var dataItem = { "time": timeStamp, "gaze_x": data['gaze_x'],"gaze_y": data['gaze_y'],
      "marker": currentState, "state" : currentState};

      this.experimentData.push(dataItem);
      this.removeValueFromArray(this.uncompletedExperimentRequests, timeStamp);
    });
  }

  private removeValueFromArray(array, item )
  {
    var index = array.indexOf(item);
    if (index !== -1)
    {
      array.splice(index, 1);
    }
  }

  // public proceedResults(saccadeResults: string)
  // {
  //   this.dataService.postResultsData(this.calibrationData, this.experimentData).subscribe((data: any[])=>{

  //     console.log("RESULTS RECEIVED FROM API:")
  //     console.log("Estimation Data:")
  //     console.log(JSON.stringify(data['result_data']));
  //     console.log("Image Data:")
  //     console.log(JSON.stringify(data['result_image']));
  //     saccadeResults = JSON.stringify(data['result_data']);
  //     console.log("Results applied...");
  //     return saccadeResults;

  //     //console.log("Imager rendering...");
  //     //imageResults.src = "data:image/png;base64, " + JSON.stringify(data['result_image']);
  //   });
  // }

  public async proceedSaccadeResults(distanceFromScreen: number, screenResolution:Array<any>, screenWidthMM: number): Promise<any[]> {
    return new Promise((resolve, reject) => {

      this.dataService.postResultsData(this.calibrationData, this.experimentData, distanceFromScreen,
        screenResolution, screenWidthMM, this.formData).subscribe((data: any[])=>{

        console.log("RESULTS RECEIVED FROM API:")
        console.log("Estimation Data:")
        console.log(JSON.stringify(data['result_data']));
        console.log("Image Data:")
        console.log(JSON.stringify(data['result_image']));
        var saccadeResults = JSON.stringify(data['result_data']);
        console.log("Results applied: " + saccadeResults);

        resolve(data);

      });

    })};

    public async TestPromise(): Promise<string> {
      return new Promise((resolve, reject) => {

        this.dataService.testGetRequest().subscribe((data: any[])=>{

          var response = JSON.stringify(data);
          console.log(response);
          resolve(response);

        });

      })};

  }
