'use strict'

const request = require('request')
const cheerio = require('cheerio')

function requestURL(url, done) {
  if (!url) return done(new Error('URL is invalid'), null)
  return request(url, (err, response, body) => {
    return done(err, {response, body})
  })
}

function parseBody(body) {
  if (!body) throw new Error('Body is invalid')
  return cheerio.load(body)
}

function extractInfos(element) {
  const list = element('.lister-list tr')
  const data = []
  if (!list.length) return titles
  list.each(function() {
    data.push({
      title:  element(this).find('.titleColumn a').text().trim(),
      rating: element(this).find('.imdbRating strong').text().trim()
    })
  })
  return data
}

(function construct() {
  const URL = 'http://www.imdb.com/chart/moviemeter'
  requestURL(URL, (err, data) => {
    if (err) console.error(err)
    const element = parseBody(data.body)
    const infos   = extractInfos(element)
    console.log(infos)
  })
})()
