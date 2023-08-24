export interface Group {
  info: Coding;
  subGroups?: SubGroup[];
}

export interface SubGroup {
  info: Coding;
  isChecked: boolean;
}

export interface MenuItem {
  group: Coding;
  subGroup?: Coding
  infos: Coding[];
}

export interface Coding {
  system?: string;
  version?: string;
  code: string;
  display: string;
  userSelected?: boolean;
}

export interface CartItem {
  title: string;
  item: Coding;
}

export interface MenuKey {
  group: Coding,
  subGroup?: Coding
}
