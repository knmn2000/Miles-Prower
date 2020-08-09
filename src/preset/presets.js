var preset = {
  template: String.raw`import time
import scrapy

from sonic.settings import ItemType
from sonic.sonic_utils import SonicUtils


class ScraperClass(scrapy.Spider):
    # VERIFY NAMES AND ABBREVIATIONS
    name = "X_NAME_ABBR"
    regulator = "REG (CTRY)"
    country = "COUNTRY"
    regulator_full_name = "REGULATOR_FULL_NAME"

    main_url = "https://www.regulatorWebsite.com"
    sheet_name = "X_NAME_ABBR"
    fieldnames = [
        "regulator",
        "regulator_full_name",
        "country",
        "activity",
        "document_type",
        # match field names from zoho sheet
    ]
    target_urls = []
    hardcoded_dates = {}  # possible ? getDates() : hardCodeDates()
    utils = SonicUtils()
    item_type = ItemType.REGULATION.value

    def _parse_method_template(self, response):
        """method to parse urls obtained from zoho and fetch 
           titles, links and dates
        Args:
            response (object): scrapy object containing response from the url

        Yields:
            [sonic.items.SonicItem] -- contains meta for each object scraped.
        """
        meta = response.meta
        url = response.url
        for element in elements:
            link = element.xpath("//*LINK").extract_first()
            title = element.xpath("//*TITLE").extract_first()
            date = response.xpath("//*DATE").extract()
            link = response.urljoin(link)
            meta.update(
                {
                    "title": title,
                    "link": link,
                    "date": date,
                    "response_url": response.url,
                    "is_html": False,
                }
            )
            yield self.utils.create_items(**meta)

    def _parse_method_template_with_pagination(self, response):
        """method to parse urls obtained from zoho and fetch 
           titles, links and dates
        Args:
            response (object): scrapy object containing response from the url

        Yields:
            [sonic.items.SonicItem] -- contains meta for each object scraped.
        """
        meta = response.meta
        url = response.url
        for element in elements:
            link = element.xpath("//*LINK").extract_first()
            title = element.xpath("//*TITLE").extract_first()
            date = response.xpath("//*DATE").extract()
            link = response.urljoin(link)
            meta.update(
                {
                    "title": title,
                    "link": link,
                    "date": date,
                    "response_url": response.url,
                    "is_html": False,
                }
            )
            yield self.utils.create_items(**meta)

        next_page = response.xpath("//*PAGINATION_LINK").extract_first()
        if next_page is not None:  # Change condition as required
            next_page_url = response.urljoin(next_page)
            yield scrapy.Request(
                next_page_url, callback=self._parse_consultation, meta=meta
            )

    def start_requests(self):
        """Scrapy method to start requests, call parsers and pass meta info based on the urls fetched from zoho.

        Yields:
            scrapy.Request: scrapy Request constructor to complete the download and pass in the parsers in callback
        """
        urls, meta_list = self.utils.read_from_zoho(
            country_from_sheet_flag=True,
            sheet_name=self.sheet_name,
            fieldnames=self.fieldnames,
            regulator_full_name=self.regulator_full_name,
            regulator=self.regulator,
            country=self.country,
        )

        for url, meta in zip(urls, meta_list):
            meta.update({"item_type": self.item_type})
            document_type = meta.get("document_type")
            activity = meta.get("activity")
            if document_type == "doc_type":
                yield scrapy.Request(
                    url, callback=self._parse_method_template, meta=meta
                )
            if activity == "activity":
                yield scrapy.Request(
                    url, callback=self._parse_method_template, meta=meta
                )
            if "keyword" in url:
                yield scrapy.Request(
                    url, callback=self._parse_method_template, meta=meta
                )
            if url in self.target_urls:
                yield scrapy.Request(
                    url, callback=self._parse_method_template, meta=meta
                )

`,
  selenium_imports: `import logging
import re
import time
from os.path import abspath, dirname, join

import dateparser
import scrapy
from scrapy.http import HtmlResponse
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.remote.remote_connection import LOGGER
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait

from sonic.settings import ItemType
from sonic.sonic_utils import SonicUtils

LOGGER.setLevel(logging.ERROR)

PATH_DIR = dirname(abspath(__file__))
GECKODRIVER_PATH = abspath(join(PATH_DIR, "../../geckodriver"))

#### DEFINE CLASS NAME AND VARIABLES 

def __init__(self, *args, **kwargs):
        options = Options()
        options.headless = True
        self.driver = webdriver.Firefox(
            options=options, executable_path=GECKODRIVER_PATH
        )

def __del__(self):
    self.driver.quit()

#### INSIDE PARSER METHOD 
meta = response.meta
source = response.url
self.driver.get(source)
`,
  pagination: `
next_page = response.xpath('//LINK TO NEXT PAGE').extract_first()
if next_page is not None:
next_page_url = response.urljoin(next_page)
yield scrapy.Request(next_page_url, callback=self._parse_method, meta=meta)

###### VER 2

# FROM HTML_SGX_SG
next_page = response.xpath('//LINK TO NEXT PAGE')
last_page = next_page.xpath("./CONDITION FOR LAST PAGE").extract_first()
if last_page is None:
    next_page_url = next_page.xpath("./@href").extract_first()
    if next_page_url is not None:
        next_page_url = response.urljoin(next_page_url)
        yield scrapy.Request(
            next_page_url, callback=self._parse_method, meta=meta
        )

###### VER 3

# FROM N_BAFIN_GE
next_page = response.xpath(
            '//*NEXT PAGE LINK'
        ).extract_first()
if next_page is not None:
    next_page_url = response.urljoin(next_page)
    yield scrapy.Request(next_page_url, callback=self._parse_method, meta=meta)`,
  infinite_scrolling: `  
# FROM N_ECB_EU

meta = response.meta
self.driver.get(response.url)
self.driver.implicitly_wait(self.wait_time)
body = self.driver.page_source
actions = ActionChains(self.driver)
response = HtmlResponse(
    self.driver.current_url, body=body, encoding="utf-8"
)  # handing over html response from selenium
snippets = self.driver.find_elements_by_xpath("//*ELEMENTS THAT LOAD ON SCROLLING")
for snippet in snippets:
    # loading parts of the page by scrolling them into view
    self.driver.execute_script("arguments[0].scrollIntoView();", snippet)
    entries = snippet.find_elements_by_xpath("./FIND NEXT ELEMENT")
    for entry in entries:
        try:
            # scraping code 
        except:
            self.driver.implicitly_wait(self.wait_time)`,
  html_response: `
meta = response.meta
self.driver.get(response.url)
self.driver.implicitly_wait(self.wait_time)
body = self.driver.page_source
actions = ActionChains(self.driver)
response = HtmlResponse(
    self.driver.current_url, body=body, encoding="utf-8"
)  # handing over html response from selenium`,
};
export default preset;
