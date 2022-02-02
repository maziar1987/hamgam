class ShebaValidation {

  private static readonly banks = new Map([
    ['21', 'پست بانک'],
    ['57', 'بانک پاسارگاد'],
    ['75', 'اعتباری عسگریه'],
    ['54', 'بانک پارسيان'],
    ['64', 'بانک گردشگري'],
    ['53', 'بانک کارآفرين'],
    ['16', 'بانک کشاورزي'],
    ['62', 'بانک آینده'],
    ['55', 'بانک اقتصاد نوين'],
    ['63', 'بانک انصار'],
    ['69', 'بانک ايران زمين'],
    ['18', 'بانک تجارت'],
    ['20', 'بانک توسعه صادرات'],
    ['65', 'بانک حکمت ايرانيان'],
    ['78', 'بانک خاور میانه'],
    ['66', 'بانک دي'],
    ['13', 'بانک رفاه'],
    ['15', 'بانک سپه'],
    ['56', 'بانک سامان'],
    ['58', 'بانک سرمايه'],
    ['59', 'بانک سينا'],
    ['61', 'بانک شهر'],
    ['19', 'بانک صادرات ايران'],
    ['11', 'بانک صنعت و معدن'],
    ['70', 'بانک قرض الحسنه رسالت'],
    ['52', 'بانک قوامین'],
    ['10', 'بانک مرکزی'],
    ['14', 'بانک مسکن'],
    ['95', 'بانک مشترک ایران و ونزویلا'],
    ['12', 'بانک ملت'],
    ['17', 'بانک ملي ايران'],
    ['22', 'توسعه تعاون'],
    ['93', 'شاپرک'],
    ['60', 'قرض الحسنه مهر'],
    ['51', 'موسسه اعتباري توسعه'],
    ['73', 'بانک سپه(کوثر سابق)'],
    ['80', 'موسسه مالی واعتباری نور'],
    ['79', 'بانک سپه (مهر اقتصاد سابق)']
  ]);

  private static numbersOf(text: string): string {
    return text.replace('[^\\d]', '');
  }

  public static verifyIban(iban: string): boolean {
    if (iban.startsWith('IR') || iban.startsWith('ir')) {
      iban = iban.substring(2);
    }

    iban = ShebaValidation.numbersOf(iban);
    const cd: string = iban.substring(0, 2);
    iban = iban.substring(2) + '1827' + cd;
    const i: number = +iban % 97;
    return i === 1;
  }

  public static bankOf(iban: string): string {
    iban = ShebaValidation.numbersOf(iban);
    const cd: string = iban.substring(2, 5);
    return this.banks.get(cd);
  }

  public static test() {
    alert(this.verifyIban('ir240730000003179111165449'));
    alert(this.bankOf('ir240730000003179111165449'));
    alert(this.verifyIban('ir240730000003179111165445'));
  }

}
