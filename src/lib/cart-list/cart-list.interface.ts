export interface Group {
  groupName: string;
  subGroups?: SubGroup[];
  items?: Coding[];
}

export interface SubGroup {
  subGroupName: string;
  isChecked: boolean;
  items: Coding[];
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
