import {Component, OnInit} from "@angular/core";
import {SecurityService} from "../../../services/security/security.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor(private securityService: SecurityService) {
  }

  ngOnInit() {
  }

  signOut() {
    this.securityService.signOut();
  }
}
