import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';
import { NotFoundComponent }              from './not-found.component';
import { ControlErrorMessagesComponent }  from './control-error-messages.component';
import { ComposeMessageComponent }        from './compose-message/compose-message.component';

@NgModule({
  imports:      [ CommonModule, FormsModule ],
  declarations: [ NotFoundComponent, ComposeMessageComponent, ControlErrorMessagesComponent ],
  exports:      [ CommonModule, FormsModule, NotFoundComponent, ComposeMessageComponent, ControlErrorMessagesComponent ],
})
export class SharedModule { }
