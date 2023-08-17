import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Coding, Group, SubGroup } from './cart-list.interface';
import { FormsModule } from '@angular/forms';
import "@his-base/array-extension";

@Component({
  selector: 'his-cart-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  @Input() value: Group[] = [];
  @Input() codings: Coding[] = [];
  @Output() codingsChange = new EventEmitter<Coding[]>();
  @Output() hide = new EventEmitter<void>;
  currentGroup: Group = {} as Group;
  subGroups: SubGroup[] = [];
  selectedCodings: Coding[] = [];
  cart: any[] = [];

  ngOnInit(): void {
    this.#cleanCheck();
    this.currentGroup = this.value[0]
  }

  onGroupClick(group: Group) {
    this.subGroups = [];
    this.#cleanCheck();
    this.currentGroup = group;
  }

  onSubGroupChange(subGroup: SubGroup) {
    if (subGroup.showItems) {
      this.subGroups.push(subGroup);
    } else {
      const index = this.subGroups.indexOf(subGroup);
      if (index !== -1) {
        this.subGroups.splice(index, 1);
      }
    }
  }

  onItemClick(coding: Coding, subGroup?: SubGroup) {
    const isExist = this.#checkCodingExist(coding.code);
    if (!isExist) this.#addCoding(coding, subGroup);
    this.#setCart();
  }

  onCartClick(coding: Coding) {
    const index = this.selectedCodings.indexOf(coding);
    if (index !== -1) this.selectedCodings.splice(index, 1);
    this.#setCart();
  }

  onOkClick() {
    this.codingsChange.emit(this.selectedCodings);
    this.hide.emit();
  }

  #cleanCheck(): void {
    this.value.forEach(group => {
      if (group.subGroups) {
        group.subGroups.forEach(subGroup => {
          subGroup.showItems = false;
        });
      }
    });
  }

  #checkCodingExist(code: string): boolean {
    for (const coding of this.selectedCodings) {
      if (coding.code === code) {
        return true;
      };
    }
    return false;
  }

  #addCoding(coding: Coding, subGroup?: SubGroup) {
    const groupName = this.currentGroup.groupName;
    const subGroupName = subGroup ? `>${subGroup.subGroupName}` : "";
    const newCoding = coding;
    this.selectedCodings.push({
      code: newCoding.code,
      display: newCoding.display,
      version: `${groupName}${subGroupName}`
    });
  }

  #setCart(): void {
    const tmp = this.selectedCodings.groupBy((a) => a.version);
    this.cart = Object.entries(tmp);
  }
}


