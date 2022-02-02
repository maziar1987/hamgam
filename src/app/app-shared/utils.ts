export const utils = {
  filterTree($event: any) {

    if ($event.filter === null) {
      return null;
    }
    if ($event.filters === null){
      return null;
    }
    if ($event.filters) {
      $event.filter = $event.filters.global.value;
    }

    $event.filter = $event.filter.replace(/\u0643/g, '\u06A9'); // ک
    $event.filter = $event.filter.replace(/\u0649/g, '\u064A'); // ی
    $event.filter = $event.filter.replace(/\u06CC/g, '\u064A'); // ی

    return $event;
  }
};
