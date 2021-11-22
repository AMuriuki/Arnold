import math


def check_value(price):
    place_value = round(math.log10(price))
    return place_value


def get_price_range(min_price, max_price):
    prices = []
    min_price_value = check_value(min_price)
    max_price_value = check_value(max_price)
    min_price = math.floor(
        min_price/10**int(min_price_value-1)) * 10**int(min_price_value-1)
    max_price = math.ceil(
        max_price/10**int(max_price_value-1)) * 10**int(max_price_value-1)
    

    while min_price < max_price:
        min_price += 50000
        prices.append(min_price)
    return prices
