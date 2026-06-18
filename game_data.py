import math
import random
from dataclasses import dataclass, asdict


@dataclass(frozen=True)
class Location:
    id: str
    name: str
    lat: float
    lng: float


@dataclass(frozen=True)
class Car:
    name: str
    range_km: int
    battery_kwh: int
    consumption_kwh_100km: float


CARS = [
    Car('Renault Megane E-Tech', 450, 60, 15.2),
    Car('Peugeot e-208', 360, 51, 14.5),
    Car('Tesla Model 3', 560, 75, 14.0),
    Car('Citroen e-C4', 420, 54, 15.4),
    Car('Hyundai Kona Electric', 480, 65, 14.7),
]

CITIES = [
    Location('paris', 'Paris', 48.8566, 2.3522),
    Location('lille', 'Lille', 50.6292, 3.0573),
    Location('rennes', 'Rennes', 48.1173, -1.6778),
    Location('brest', 'Brest', 48.3904, -4.4861),
    Location('nantes', 'Nantes', 47.2184, -1.5536),
    Location('bordeaux', 'Bordeaux', 44.8378, -0.5792),
    Location('toulouse', 'Toulouse', 43.6047, 1.4442),
    Location('montpellier', 'Montpellier', 43.6119, 3.8772),
    Location('marseille', 'Marseille', 43.2965, 5.3698),
    Location('nice', 'Nice', 43.7102, 7.2620),
    Location('lyon', 'Lyon', 45.7640, 4.8357),
    Location('grenoble', 'Grenoble', 45.1885, 5.7245),
    Location('clermont', 'Clermont-Ferrand', 45.7772, 3.0870),
    Location('dijon', 'Dijon', 47.3220, 5.0415),
    Location('strasbourg', 'Strasbourg', 48.5734, 7.7521),
    Location('nancy', 'Nancy', 48.6921, 6.1844),
    Location('reims', 'Reims', 49.2583, 4.0317),
    Location('limoges', 'Limoges', 45.8336, 1.2611),
    Location('poitiers', 'Poitiers', 46.5802, 0.3404),
    Location('orleans', 'Orleans', 47.9029, 1.9093),
]

STATIONS = [
    Location('st_amiens', 'Amiens Supercharger', 49.8941, 2.2958),
    Location('st_rouen', 'Rouen Charge Hub', 49.4431, 1.0993),
    Location('st_caen', 'Caen Fast Charge', 49.1829, -0.3707),
    Location('st_le_mans', 'Le Mans Ionity', 48.0061, 0.1996),
    Location('st_tours', 'Tours Sud Recharge', 47.3941, 0.6848),
    Location('st_poitiers', 'Poitiers Charge', 46.5802, 0.3404),
    Location('st_angouleme', 'Angouleme Fast Charge', 45.6484, 0.1562),
    Location('st_bordeaux', 'Bordeaux Lac Station', 44.8700, -0.5600),
    Location('st_brive', 'Brive Recharge', 45.1589, 1.5333),
    Location('st_montauban', 'Montauban Charge', 44.0176, 1.3550),
    Location('st_toulouse', 'Toulouse Est Fast Charge', 43.6047, 1.4442),
    Location('st_narbonne', 'Narbonne Charge Hub', 43.1843, 3.0031),
    Location('st_nimes', 'Nimes Recharge', 43.8367, 4.3601),
    Location('st_avignon', 'Avignon Fast Charge', 43.9493, 4.8055),
    Location('st_aix', 'Aix-en-Provence Charge', 43.5297, 5.4474),
    Location('st_valence', 'Valence Charge Hub', 44.9334, 4.8924),
    Location('st_lyon', 'Lyon East Station', 45.7640, 4.8357),
    Location('st_macon', 'Macon Recharge', 46.3069, 4.8287),
    Location('st_dijon', 'Dijon Nord Charge', 47.3220, 5.0415),
    Location('st_besancon', 'Besancon Fast Charge', 47.2378, 6.0241),
    Location('st_mulhouse', 'Mulhouse Station', 47.7508, 7.3359),
    Location('st_metz', 'Metz Charge Hub', 49.1193, 6.1757),
    Location('st_reims', 'Reims Fast Charge', 49.2583, 4.0317),
    Location('st_orleans', 'Orleans Station', 47.9029, 1.9093),
    Location('st_bourges', 'Bourges Recharge', 47.0810, 2.3988),
    Location('st_clermont', 'Clermont Fast Charge', 45.7772, 3.0870),
    Location('st_limoges', 'Limoges Charge Hub', 45.8336, 1.2611),
    Location('st_rennes', 'Rennes Recharge', 48.1173, -1.6778),
    Location('st_vannes', 'Vannes Fast Charge', 47.6582, -2.7608),
    Location('st_nantes', 'Nantes Station', 47.2184, -1.5536),
]


def distance_km(a, b):
    radius = 6371
    lat1 = math.radians(a.lat)
    lat2 = math.radians(b.lat)
    dlat = math.radians(b.lat - a.lat)
    dlng = math.radians(b.lng - a.lng)
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2
    return round(2 * radius * math.asin(math.sqrt(h)), 1)


def choose_route():
    car = random.choice(CARS)
    candidates = []
    for start in CITIES:
        for end in CITIES:
            if start.id == end.id:
                continue
            direct = distance_km(start, end)
            if direct > car.range_km * 1.15:
                candidates.append((start, end, direct))
    start, end, direct = random.choice(candidates)
    return car, start, end, direct


def nearest_station_hint(start, end, car):
    useful = []
    for station in STATIONS:
        d1 = distance_km(start, station)
        d2 = distance_km(station, end)
        if d1 <= car.range_km and d2 <= car.range_km:
            useful.append((station, d1 + d2, d1, d2))
    useful.sort(key=lambda item: item[1])
    return useful[:3]


def create_game():
    car, start, end, direct = choose_route()
    hints = nearest_station_hint(start, end, car)
    return {
        'car': asdict(car),
        'start': asdict(start),
        'end': asdict(end),
        'directDistanceKm': direct,
        'stations': [asdict(station) for station in STATIONS],
        'hints': [
            {
                'station': asdict(station),
                'totalKm': total,
                'legToStationKm': leg1,
                'legToEndKm': leg2,
            }
            for station, total, leg1, leg2 in hints
        ],
        'rules': {
            'initialChargePercent': 100,
            'stationCost': 0,
            'easyMode': True,
            'objective': 'Reach point B with the lowest total distance and fewest recharge stops.',
        },
    }
