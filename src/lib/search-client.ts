import { Country } from "@medusajs/medusa";
import Medusa from "@medusajs/medusa-js"
import useCountryOptions from "./hooks/use-country-options";
import { domainToASCII } from "url";
import { medusaClient } from "@lib/config"
import { useStore } from "./context/store-context";
import CountryMenu from "@modules/mobile-menu/components/country-menu";
// import { SearchClient, InstantSearch } from 'instantsearch.js'

export const searchClient = {
  async search(requests: any) { // Any??
    console.log("-------FULL SEARCH REQUEST-----")
    console.log(requests)
    let query = requests[0].params.query
    console.log("-------QUERY-----")
    console.log(query)

    // const { countryCode } = useStore()
    // console.log(countryCode)
    // const medusa = new Medusa({ baseUrl: "http://localhost:9000", maxRetries: 3 })
    // medusa.regions.list()
    //   .then(({ regions }) => {
    //     console.log(regions);
    //   });
    // medusa.products.search()
    return fetch('http://localhost:9000/store/products/search', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          indexName: "",
          query: query,
          options: {
            languageCode: 'en',
            nProductsToRetrieve: 20
          }
        }
        ),
    }).then(async res => {
      console.log("LOOOOOK HERE22")
      // console.log(await res.text())
      let res_json = await res.json()
      console.log(res_json)
      return {
        results: [
          {
            hits: res_json.hits
          }
        ]
      };
    });
  }
  ,
  async searchForFacetValues(requests: any) { // Doesnt currently have any effect. Not sure if supported.
    console.log("--------- FULL FACET VALUES REQUEST --------")
    console.log(requests)
    return fetch('http://localhost:3000/sffv', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }).then(res => res.json());
  }
};

/* // var instantsearch = require('instantsearch.js');
import instantsearch from "instantsearch.js";
// import * as instantsearch from 'instantsearch.js';

const search = instantsearch({
  indexName: "YourIndexName",
  searchClient: customSearchClient
});

search.start(); // Remove? */


/* import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
const endpoint =
  process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://127.0.0.1:7700"

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

export const searchClient = instantMeiliSearch(endpoint, apiKey)
 */
export const SEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_INDEX_NAME || "products"


// If you want to use Algolia instead then uncomment the following lines, and delete the above lines
// you should also install algoliasearch - yarn add algoliasearch

// import algoliasearch from "algoliasearch/lite"

// const appId = process.env.NEXT_PUBLIC_SEARCH_APP_ID || "test_app_id"

// const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

// export const searchClient = algoliasearch(appId, apiKey)

// export const SEARCH_INDEX_NAME =
//   process.env.NEXT_PUBLIC_INDEX_NAME || "products"
