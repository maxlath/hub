const domains = {
  // Subset of CommonsMedia properties
  image: 'P18,P4291,P4640,P3451,P3383,P2716,P154,P41,P94,P14,P15,P109,P117,P158,P181,P207,P242,P367,P491,P692,P948,P1442,P1543,P1621,P1766,P1801,P1846,P1943,P1944,P2343,P2425,P2713,P2910,P2919,P3030,P3311,P4004',

  social: 'P4033,P2002,P2013,P1997,P4003,P2003,P4173,P2847,P4173,P4264'
}

module.exports = propertyStr => {
  return propertyStr
  .replace('image', domains.image)
  .replace('social', domains.social)
}
