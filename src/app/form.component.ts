import { Component} from '@angular/core';
import { DataCollectorService } from './datacollector.service';
import {Router} from '@angular/router';


@Component({
  selector: 'form',
  templateUrl: './form.component.html',
  styleUrls: ['./app.component.scss'
              ]
})
export class FormComponent  {
  logoSrc = "../assets/eye_track_green.png"
  pjatkSrc = "../assets/pjatk_2.png"
  eyeSrc = "../assets/eye_1.png"

  public id: string;
  public sex: number;
  public age: number;
  public visionDefect: number;
  public stress: number;
  public mood: number;
  public showFormError : boolean = true;
  public validationText : string = "Proszę o wypełnienie formularza";


  constructor(private dataCollectorService : DataCollectorService, private router:Router){}

  async ngAfterViewInit() {

      console.log("Form Data: " + JSON.stringify(this.dataCollectorService.formData));
      if(this.dataCollectorService.formData != undefined)
      {
        this.sex = this.dataCollectorService.formData['sex'] == "K" ? 0 : 1;
        this.age = this.dataCollectorService.formData['age'];
        this.visionDefect = this.dataCollectorService.formData['visionDefect'];
        this.stress = this.dataCollectorService.formData['stress'];
        this.mood = this.dataCollectorService.formData['mood'];

      }
  }

  getFormData()
  {
    if(this.sex == undefined && this.age == undefined)
    {
      this.validationText = "Proszę o wypełnienie formularza";
      this.showFormError = true;
    }
    else if(this.sex == undefined)
    {
      this.validationText = "Proszę podać płeć";
      this.showFormError = true;
    }
    else if(this.age == undefined)
    {
      this.validationText = "Proszę podać wiek";
      this.showFormError = true;
    }
    else if(this.age < 5 || this.age > 120 )
    {
      this.validationText = "Dopuszczalny zakres wieku to 5-120 lat";
      this.showFormError = true;
    }
    else if(this.visionDefect == undefined)
    {
      this.validationText = "Proszę wskazać czy jest wada wzroku";
      this.showFormError = true;
    }
    else if(this.stress == undefined)
    {
      this.validationText = "Proszę wskazać aktualny poziom stresu";
      this.showFormError = true;
    }
    else if(this.mood == undefined)
    {
      this.validationText = "Proszę wskazać aktualny nastrój";
      this.showFormError = true;
    }
    else
    {
      this.showFormError = false;

      this.dataCollectorService.formData = {
        "type": "HC",
        "sex" : this.sex == 0 ? "K" : "M",
        "age" : this.age,
        "visionDefect" : this.visionDefect,
        "stress" : this.stress,
        "mood" : this.mood,
      };

      this.router.navigate(['/camera']);

    }

  }

}