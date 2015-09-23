var listings = [];
var fetched = 0;

fetchNewestPedals();
setInterval(fetchNewestPedals, 60000);

function fetchNewestPedals() {
  fetched = 0;
  $.get('https://reverb.com/api/listings', { product_type: 'effects-pedals', price_max: 100 }, function(response) {
    listings = response.listings;
    renderListings();
  });
}

function renderListings() {
  $tbody = $('#listings tbody');
  $tbody.html('');

  for(var i=0,len=listings.length;i<len;i++) {
    $tbody.append(renderListing(listings[i]));
    fetchPGData(listings[i], i);
  }
}

function renderListing(listing) {
  return '<tr><td><a href="' + listing._links.web.href + '">'+ listing.title + '</a></td><td>' + pgData(listing) + '</td><td>' + listing.price.symbol + listing.price.amount + '</td></tr>';
}

function fetchPGData(listing, index) {
  $.get('https://reverb.com/api/priceguide', { make: listing.make, model: listing.model }, function(response) {
    fetched += 1;
    if(fetched <= listings.length) {
      if(response.price_guides.length) {
        listings[index].priceGuideMin = response.price_guides[0].estimated_value.bottom_price;
      }
      if(fetched >= listings.length) {
        renderListings();
      }
    }
  });
}

function pgData(listing) {
  if(listing.priceGuideMin) {
    return '$' + listing.priceGuideMin;
  } else {
    return 'None';
  }
}
