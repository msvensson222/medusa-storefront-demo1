import { Country } from "@medusajs/medusa";
import Medusa from "@medusajs/medusa-js"
import useCountryOptions from "./hooks/use-country-options";
import { domainToASCII } from "url";
import { medusaClient } from "@lib/config"
import { useStore } from "./context/store-context";
import CountryMenu from "@modules/mobile-menu/components/country-menu";
import CountrySelect from "@modules/layout/components/country-select"
import { useRegions } from "medusa-react"
import { SearchRequest, SearchResponse } from "meilisearch";
import { instantMeiliSearch, InstantMeiliSearchInstance } from "@meilisearch/instant-meilisearch"

import Search from "@modules/common/icons/search";
// import { SearchClient, InstantSearch } from 'instantsearch.js'

export const searchClient: InstantMeiliSearchInstance = {
  search(requests: any) { // TODO: Add SearchRequest / SearchResponse, and try running yarn build
    // console.log(`Full search request: ${requests}`)

    let query = requests[0].params.query
    // console.log(`Query: ${query}`)
    const json_region = localStorage.getItem("medusa_region")
    // console.log(`json_region: ${json_region}`)
    let region: any
    if (json_region) {
      region = JSON.parse(json_region) as { regionId: string; countryCode: string }
    }
    // console.log(`Region: ${region}`)
    // console.log(`Country code: ${region.countryCode}`)
    let languageCode: string
    switch (region.countryCode) {
      case 'en':
        languageCode = 'en'
        break;
      case 'se':
        languageCode = 'sv'
        break;
      case 'gb':
        languageCode = 'en'
        break;
      case 'de':
        languageCode = 'de'
        break;
      case 'dk':
        languageCode = 'da'
        break;
      case 'fr':
        languageCode = 'fr'
        break;
      case 'es':
        languageCode = 'es'
        break;
      case 'it':
        languageCode = 'it'
        break;
      default:
        languageCode = 'en'
    }

    const SEARCH_ENDPOINT='https://demo1-custom-search-api-eorit2dhbq-ew.a.run.app' // 'http://127.0.0.1:5000'
    const SEARCH_API_KEY='customsearch123'
    const nProductsToRetrieve=20
    console.log(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL)
    return fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/search`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        { 
          indexName: "",
          query: query,
          options: {
            languageCode: languageCode,
            nProductsToRetrieve: nProductsToRetrieve,
            apiKey: SEARCH_API_KEY,
            endpointURL: `${SEARCH_ENDPOINT}/search`
          }
        }
        ),
    }).then(async res => {
      let res_json = await res.json()
      // console.log(`Search response:`)
      // console.log(res_json)
      return {
        results: [
          {
            hits: res_json.hits,
            nbHits: nProductsToRetrieve,
            page: 0,
            nbPages: 1,
            hitsPerPage: nProductsToRetrieve,
            processingTimeMS: 1,
            exhaustiveNbHits: true,
            query: query,
            params: ""
          }
        ]
      };
    });
  }
  ,
  searchForFacetValues: async function (_: any) { // Doesnt currently have any effect. Not sure if supported.
    // Probably need to have this method in the custom search endpoint
    // Should return SearchForFacetValuesResponse
    // console.log("--------- FULL FACET VALUES REQUEST --------")
    // console.log(requests)
    return await new Promise((resolve, reject) => {
      reject(
        new Error('SearchForFacetValues is not compatible with custom Meilisearch')
      )
      resolve([]) // added here to avoid compilation error
    })
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

function mapCountryToLanguage(country: string) {
  let language: string
  switch (country) {
    case 'Sweden':
      language = 'Swedish'
      break;
    case 'United Kingdom':
      language = 'English'
      break;
    case 'Germany':
      language = 'German'
      break;
    case 'Denmark':
      language = 'Danish'
      break;
    case 'France':
      language = 'French'
      break;
    case 'Spain':
      language = 'Spanish'
      break;
    case 'Italy':
      language = 'Italian'
      break;
    default:
      language = 'English'
  }
  return language
}
export { mapCountryToLanguage }
