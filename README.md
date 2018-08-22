
<!-- README.md is generated from README.Rmd. Please edit that file -->
An R Interface to deck.gl
=========================

Deckgl for R makes the open-source JavaScript library [deck.gl](https://deck.gl/) available within R via the [htmlwidgets](https://www.htmlwidgets.org/) package.

Notes
-----

-   It is a known issue that the deckgl widget might not be visible in the viewer pane of RStudio. Just open it in your browser by clicking *Show in new window* and everything will be fine.
-   The documentation is in a very early stage. Please check the [examples](inst/examples) as a starting point.
-   You do *not* need a [mapbox](https://www.mapbox.com/) api key to use this package. It is always optional to add a base map from mapbox to your widget.

Installation
------------

You can install deckgl from github with:

``` r
# install.packages("devtools")
devtools::install_github("crazycapivara/deckgl")
```

Quickstart
----------

Just check if everything is fine:

``` r
library(deckgl)

does_it_work()
#> You should see a text layer telling you that it works.

# Or in case you do have a mapbox api token ...
does_it_work("yourSuperSecretApiToken")
#> Output should be the same as above but rendered on top of a base map from mapbox.
```

Show some sample data:

``` r
deckgl() %>%
  add_hexagon_layer() %>% # 'data = NULL' will load some sample data
  add_mapbox_basemap("yourSuperSecretApiToken") # optional
```

Scatterplot example:

``` r
# install.packages("geojsonio") # just for the data set
data <- geojsonio::canada_cities

# The 'properties' parameter is a named list with names
# corresponding to the properties for the given layer type
# as described in the 'deck.gl api reference'
# e. g. http://deck.gl/#/documentation/deckgl-api-reference/layers/scatterplot-layer
properties <- list(
 getPosition = JS("data => [data.long, data.lat]"),
 radiusMinPixels = 2,
 getRadius = 1000,
 getColor = c(240, 130, 20)
)

deckgl(latitude = 49.06, longitude = -122.3, zoom = 4) %>%
  add_scatterplot_layer(data = data, properties = properties) %>%
  add_mapbox_basemap("yourSuperSecretApiToken") # optional
```
