export interface UiItem {
  id: number;
  name: string;
}

export enum UiItemValue {
  کارپوشه = 1,
  اطلاعات_پايه = 2,
  // اطلاعات_پايه_مقادير_پايه = 3,
  // اطلاعات_پايه_افراد = 4,
  // اطلاعات_پايه_واحد_سازماني = 5,
  افراد_خبره = 6,
  // مديريت_کنترل_دسترسي = 7,
  کارگروه_خبرگي = 8,
  آيين_نامه_ها = 9,
  مديريت_سامانه = 10,
  // مديريت_کاربران = 11
}
