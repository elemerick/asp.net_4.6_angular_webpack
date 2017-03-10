import { NgModule }                       from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';
import { NotFoundComponent }              from './not-found.component';
import { ComposeMessageComponent }        from './compose-message/compose-message.component';

@NgModule({
  imports:      [ CommonModule, FormsModule ],
  declarations: [ NotFoundComponent, ComposeMessageComponent ],
  exports:      [ CommonModule, FormsModule, NotFoundComponent, ComposeMessageComponent ],
})
export class SharedModule { }
