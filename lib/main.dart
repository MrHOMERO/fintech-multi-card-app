import 'package:flutter/material.dart';
import 'models/card_model.dart';
import 'services/mock_bank_service.dart';

void main() {
  runApp(const MultiBankApp());
}

class MultiBankApp extends StatelessWidget {
  const MultiBankApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Billetera Central',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF121212),
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final MockBankService _bankService = MockBankService();
  late Future<List<BankCard>> _cardsFuture;
  String? _selectedCardId;

  @override
  void initState() {
    super.initState();
    _cardsFuture = _bankService.fetchUserCards();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Tarjetas & Saldos'),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: FutureBuilder<List<BankCard>>(
        future: _cardsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return const Center(child: Text('Error al cargar datos bancarios'));
          }

          final cards = snapshot.data ?? [];
          _selectedCardId ??= cards.isNotEmpty ? cards.first.id : null;

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  itemCount: cards.length,
                  padding: const EdgeInsets.all(16),
                  itemBuilder: (context, index) {
                    final card = cards[index];
                    final isSelected = card.id == _selectedCardId;

                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedCardId = card.id;
                        });
                      },
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Color(int.parse(card.colorHex)),
                          borderRadius: BorderRadius.circular(16),
                          border: isSelected
                              ? Border.all(color: Colors.white, width: 3)
                              : null,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            )
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  card.bankName,
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  card.cardType,
                                  style: const TextStyle(color: Colors.white70),
                                ),
                              ],
                            ),
                            const SizedBox(height: 24),
                            Text(
                              'Saldo disponible: ${card.currency} \$${card.balance.toStringAsFixed(2)}',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  card.cardHolder,
                                  style: const TextStyle(color: Colors.white70),
                                ),
                                Text(
                                  '**** ${card.lastFourDigits}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    letterSpacing: 2,
                                  ),
                                ),
                              ],
                            )
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    minimumSize: const Size(double.infinity, 54),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () {
                    final selectedCard = cards.firstWhere((c) => c.id == _selectedCardId);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Tarjeta activa para pago NFC: ${selectedCard.bankName} (**** ${selectedCard.lastFourDigits})'),
                      ),
                    );
                  },
                  icon: const Icon(Icons.nfc),
                  label: const Text(
                    'Pagar con esta tarjeta (NFC)',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              )
            ],
          );
        },
      ),
    );
  }
}
