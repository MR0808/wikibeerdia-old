import Country from '../models/country.js';
import State from '../models/state.js';
import City from '../models/city.js';

export async function getCities(req, res, next) {
    const city = req.query.query;
    const cities = await City.find({
        name: { $regex: '^' + city, $options: 'i' }
    })
        .limit(10)
        .populate('state', 'name')
        .populate('country', 'name');
    const citiesReturn = [];
    cities.forEach((c) => {
        citiesReturn.push({
            value: c.name + ', ' + c.state.name + ', ' + c.country.name,
            data: c._id.toString()
        });
    });

    const result = { suggestions: citiesReturn };
    return res.send(JSON.stringify(result));
}
