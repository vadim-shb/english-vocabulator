import {Component, OnInit} from "@angular/core";
import {SecurityService} from "../../../services/security/security.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor(private securityService: SecurityService) {
  }

  ngOnInit() {
  }

  signOut() {
    this.securityService.signOut();
  }
}
