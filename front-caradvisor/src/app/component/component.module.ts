import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublishComponent } from './publish/publish.component';

@NgModule({
  declarations: [PublishComponent],
  exports: [PublishComponent],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ComponentModule {}
