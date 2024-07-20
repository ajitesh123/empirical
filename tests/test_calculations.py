import unittest

def calculate_total(items):
    return sum(item['price'] * item['quantity'] for item in items)

class TestCalculations(unittest.TestCase):
    def test_calculate_total(self):
        self.assertEqual(calculate_total([]), 0)
        self.assertEqual(calculate_total([{'price': 10, 'quantity': 2}, {'price': 5, 'quantity': 1}]), 25)
        self.assertEqual(calculate_total([{'price': 10, 'quantity': 1.5}]), 15)

if __name__ == '__main__':
    unittest.main()
