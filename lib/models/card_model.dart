class BankCard {
  final String id;
  final String bankName;
  final String cardHolder;
  final String lastFourDigits;
  final double balance;
  final String currency;
  final String cardType;
  final String colorHex;

  BankCard({
    required this.id,
    required this.bankName,
    required this.cardHolder,
    required this.lastFourDigits,
    required this.balance,
    required this.currency,
    required this.cardType,
    required this.colorHex,
  });

  factory BankCard.fromJson(Map<String, dynamic> json) {
    return BankCard(
      id: json['id'],
      bankName: json['bankName'],
      cardHolder: json['cardHolder'],
      lastFourDigits: json['lastFourDigits'],
      balance: (json['balance'] as num).toDouble(),
      currency: json['currency'],
      cardType: json['cardType'],
      colorHex: json['colorHex'],
    );
  }
}
