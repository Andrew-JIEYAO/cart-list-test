import { Component, EventEmitter, Input, OnInit, Output, Signal, SimpleChanges, WritableSignal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, Coding, Group, MenuItem, SubGroup, MenuKey } from './cart-list.interface';
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

  @Output() addCart = new EventEmitter<Coding[]>();
  @Output() search = new EventEmitter<string>;
  @Output() getMenuItem = new EventEmitter<MenuKey>;
  @Input() groupValue: Group[] = [];
  @Input() searchValue: MenuItem[] = [];

  #itemValue: MenuItem = {} as MenuItem;
  @Input()
  set itemValue(value: MenuItem) {
    if (value.group) {
      this.#setItemPool(value);
      this.#itemValue = value;
    }
  }
  get itemValue(): MenuItem {
    return this.#itemValue;
  }

  itemPool: Map<string, MenuItem> = new Map();
  menuKeys: MenuKey[] = [];
  currentGroup: Group = {} as Group;

  cartItems: WritableSignal<CartItem[]> = signal([]);
  groupItems: Signal<Record<string, CartItem[]>> = computed(() => this.cartItems().groupBy(v => v.title));
  groupTitles: Signal<string[]> = computed(() => Object.keys(this.groupItems()));

  keyword: string = '';
  isSearch: boolean = false;

  ngOnInit(): void {
    this.currentGroup = this.groupValue[0] || {};
  }

  /**
   * 點選到group觸發的事件
   * @param group 點選到的group
   */
  onGroupClick(group: Group) {
    if (this.currentGroup !== group) {
      this.menuKeys = [];
      if (this.currentGroup.subGroups) this.currentGroup.subGroups.map((s) => s.isChecked = false); //清空前一個group底下的subGroup的check
      if (!group.subGroups) {
        if (!this.itemPool.has(group.info.code)) this.getMenuItem.emit({group: group.info}); //處理大池子itemPool
        this.menuKeys.push({ group: group.info }); //處理決定顯不顯示的陣列menuKeys
      }
      this.currentGroup = group;
    }
  }

  /**
   * 點選到subGroup觸發的事件
   * @param subGroup 點選到的subGroup checkbox
   */
  onSubGroupClick(group: Coding, subGroup: Coding) {
    const index = this.menuKeys.findIndex((i) => i.group === group && i.subGroup === subGroup);
    if (index !== -1) {
      this.menuKeys.splice(index, 1);//處理決定顯不顯示的陣列menuKeys
    } else {
      const key = group.code.concat(subGroup.code);
      if(!this.itemPool.has(key)) this.getMenuItem.emit({group: group, subGroup:subGroup});//處理大池子itemPool
      this.menuKeys.push({ group: group, subGroup: subGroup });//處理決定顯不顯示的陣列menuKeys
    }
  }

  /**
   * 將點選到的 item 加到購物車中
   * @param coding 點選到的item
   * @param group 該 item 的 group
   * @param subGroup 該 item 的 subGroup 有可能不存在
   */
  addCartClick(item: Coding, group: Coding, subGroup?: Coding) {
    this.#addCartItem(item, group.display.concat(subGroup ? `>${subGroup.display}` : ""));
  }

  /**
   * 將購物車中的 item，拿掉
   * @param cartItem 點選到購物車中的 item
   */
  removeCartClick(cartItem: CartItem) {
    const index = this.cartItems().indexOf(cartItem);
    if (index !== -1) this.cartItems.mutate(a => a.splice(index, 1));
  }

  /**
   * 點選ok，將購物車的 item去掉title，並送出去
   */
  onOkClick() {
    this.addCart.emit(this.cartItems().map((i) => i.item));
  }

  /**
   * 將搜尋bar輸入的字串送出去給外部撈取資料
   */
  onSearch() {
    if (this.keyword !== '') {
      this.search.emit(this.keyword);
      this.isSearch = this.isSearch || !this.isSearch;
    }
  }

  /**
   * 搜尋bar取消搜尋，將原先導覽的方式放回來
   */
  onSearchCancel() {
    this.isSearch = this.isSearch && !this.isSearch;
    this.keyword = '';
  }

  /**
   * 從畫面上的group與subGroup去拿取相對應的item
   * @param menuKey
   * @returns
   */
  getItem(menuKey: MenuKey): Coding[] {
    const key = menuKey.group.code.concat(menuKey.subGroup ? menuKey.subGroup.code : '');
    return this.itemPool.get(key)?.infos || [];
  }

  /**
   * 將點選到的 item 加到購物車中的私有方法
   * @param coding 點選到的item
   * @param group 該 item 的 group
   * @param subGroup 該 item 的 subGroup 有可能不存在
   */
  #addCartItem(item: Coding, title: string): void {
    this.cartItems.mutate(a => a.push({ title,item }));
    this.cartItems.update(a => a.distinct((v) => v.item.code))
  }

  /**
   * 將外面撈取回來的item放進池子中
   * @param menuItem
   */
  #setItemPool(menuItem: MenuItem) {
    const group = menuItem.group;
    const subGroup = menuItem.subGroup;
    this.itemPool.set(group.code.concat(subGroup ? subGroup.code : ''), menuItem)
  }
}
