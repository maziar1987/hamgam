class NationalCodeValidation {

  public static isValid(nationalCode: string): boolean {
    if (!nationalCode.match('^\\d{10}$')) {
      return false;
    }

    const check: number = +nationalCode.substring(9, 10);

    const Sum: number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // is there any better way to create a range?
        .map(x => +(nationalCode.substring(x, x + 1)) * (10 - x))
        .reduce((sum: number, a: number) => sum + a, 0) // is there any better way to calculate an array sum?
      % 11;

    return (Sum < 2 && check === Sum) || (Sum >= 2 && check + Sum === 11);
  }

  public static test() {
    alert(this.isValid('0075661713'));
    alert(this.isValid('0075661714'));
  }

}
