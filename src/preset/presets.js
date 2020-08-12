var preset = {
  template: String.raw`import re
import time
import scrapy

from sonic.settings import ItemType
from sonic.sonic_utils import SonicUtils

# BOTH SCRAPER AND TEST TEMPLATES AVAILABLE
class ScraperClass(scrapy.Spider):
    # VERIFY NAMES AND ABBREVIATIONS
    name = "X_NAME_ABBR"
    regulator = "REG (CTRY)"
    country = "COUNTRY"
    regulator_full_name = "REGULATOR_FULL_NAME"
    #### REGEX DATE PATTERNS -
    pattern = re.compile(r"[\d]{1,2} [ADFJMNOS]\w* [\d]{4}")
    patternV2  = re.compile(r"[\d]{1,2}\/[\d]{1,2}\/[\d]{1,2}")
    patternV3 = re.compile(r"([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01]))")
    patternV4 = re.compile(r"\d{2}\s[a-zA-Z]{3}\s\d{4}")
    ####
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

    # VERSION 1 HTML CONTENT METHOD
    def _parse_html_content(self, response):
        self.driver.get(response.url)
        WebDriverWait(self.driver, self.delay).until(
            EC.presence_of_element_located((By.XPATH, "//RELEVANT XPATH"))
        )
        response = HtmlResponse(
            self.driver.current_url, body=self.driver.page_source, encoding="utf-8"
        )
        title = element.xpath("//*TITLE").extract_first()
        date = response.xpath("//*DATE").extract()
        html_content = " ".join(response.xpath("//XPATH TO TEXT CONTENTS").extract())
        html_meta.update(
            {
                "title": title,
                "html_content": html_content,
                "is_html": True,
                "link": response.url,
                "date": date,
                "ignore_link_check": True,
            }
        )
        yield self.utils.create_items(**html_meta)

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
##########################################################
# TEMPLATE FOR TESTS 
import logging
import time
import unittest

import pytest
import requests
import vcr
from scrapy.http import HtmlResponse, Request

from sonic.pipelines import SonicPipeline
from sonic.settings import ItemType
from sonic.spiders.regulation_spiders import ScraperClass 

# @pytest.mark.vcr(match_on=["method", "scheme", "host", "query"])
class TestScraperClass:
    spider = ScraperClass()
    example_url = "https://www.dummy.com"
    another_url = "https://www.dummy.com"
    other_url = "https://www.dummy.com"
    list_links = ["https://www.dummy.com", "https://www.dummy.com"]

    start_urls_list = [
        example_url,
        other_url,
        another_url,
    ]
    parse_list = [
        example_url,
        other_url,
        another_url,
    ]
    meta = {
        "item_type": ItemType.REGULATION.value,
        "regulator": "SC (MY)",
    }
    spider.wait_time = 0
    pipeline = SonicPipeline()
    # TEST METHOD TEMPLATES
    # @pytest.mark.vcr(match_on=["method", "scheme", "host", "query"])
    # @pytest.mark.slow
    # @pytest.mark.vcr
    def test_parse_method_name(self):
        response = requests.get(self.example_url)
        request = Request(url=self.example_url, meta=self.meta,)
        response = HtmlResponse(
            url=self.example_url,
            request=request,
            body=response.content,
            encoding="utf-8",
        )
        gen = self.spider._parse_example(response)
        results = []
        for item in gen:
            self.pipeline.process_item(item, self.spider)
            results.append(item)
        assert len(results) == 1

    # @pytest.mark.vcr(match_on=["method", "scheme", "host", "query"])
    # @pytest.mark.slow
    # @pytest.mark.vcr
    def test_parse_method_other_name(self, requests_session, mock_time):
        results = []
        for url in self.list_of_links:
            response = requests_session.get(url)
            request = Request(url=url, meta=self.meta)
            response = HtmlResponse(
                url=url, request=request, body=response.content, encoding="utf-8",
            )
            gen = self.spider._relevant_method(response)
            for item in gen:
                self.pipeline.process_item(item, self.spider)
                results.append(item)
        assert len(results) == 1

    # IF METHOD HAS BOTH PAYLOAD YIELDS AND REQUEST YIELDS **
    # @pytest.mark.vcr(match_on=["method", "scheme", "host", "query"])
    # @pytest.mark.slow
    # @pytest.mark.vcr
    def test_parse_method(self, requests_session, mock_time):
        results = []
        for url in self.list_links:
            response = requests_session.get(url)
            request = Request(url=url, meta=self.meta)
            response = HtmlResponse(
                url=url, request=request, body=response.content, encoding="utf-8",
            )
            gen = self.spider._parse_papers(response)
            for item in gen:
                try:
                    self.pipeline.process_item(item, self.spider)
                except AttributeError:
                    pass
                results.append(item)
        assert len(results) == 1

    # IF METHOD HAS "ENTRIES" ARGUMENT
    # @pytest.mark.vcr(match_on=["method", "scheme", "host", "query"])
    # @pytest.mark.slow
    # @pytest.mark.vcr
    def test_parse_pdf_entries(self, requests_session, mock_time):
        results = []
        response = requests_session.get(self.example_url)
        request = Request(url=self.example_url, meta=self.meta)
        response = HtmlResponse(
            url=self.example_url,
            request=request,
            body=response.content,
            encoding="utf-8",
        )
        entries = response.xpath("//XPATH FOR ENTRIES")
        gen = self.spider._parse_method(response, entries)
        for request in gen:
            self.pipeline.process_item(request, self.spider)
            results.append(request)
        assert len(results) == 1

    # PARSE TEST METHODS
    # @pytest.mark.vcr(match_on=["method", "scheme", "host", "query"])
    def test_parse(self, monkeypatch, requests_session):
        metas = []
        url_list = self.parse_list
        for url in url_list:
            if url == self.consultation_url:
                meta.update({"document_type": "Consultation Paper"})
            else:
                meta.update({"document_type": "dummy"})
            response = requests_session.get(url)
            request = Request(url=url, meta=self.meta)
            response = HtmlResponse(
                url=url, request=request, body=response.content, encoding="utf-8",
            )
            if url == self.consultation_url:
                feedback = "parse consultation called"
                monkeypatch.setattr(
                    self.spider, "_parse_consultations", lambda s: feedback,
                )
            if "something" in url:
                feedback = "parse something called"
                monkeypatch.setattr(
                    self.spider,
                    "_parse_something",
                    lambda s, entries: feedback,
                    "dummy",
                )
            if url == self.something_else:
                feedback = "_something_else called"
                monkeypatch.setattr(self.spider, "_something_else", lambda s: feedback)
            result = self.spider.parse(response)
            if type(result) == str:
                assert result == feedback
            else:
                metas.append([i for i in result])

    # START REQUEST TEST METHODS
    def test_start_requests(self, monkeypatch):
        for url in self.start_urls_list:
            monkeypatch.setattr(
                self.spider.utils, "read_from_zoho", lambda **args: ([url], [self.meta])
            )
            gen = self.spider.start_requests()
            for response in gen:
                if url == self.example_url:
                    assert response.callback.__name__ == "_parse_this_url"
                if "/something" in url:
                    assert response.callback.__name__ == "_parse_that_url"

    # @pytest.mark.vcr(match_on=["method", "scheme", "host", "query"])
    def test_start_requests(self, monkeypatch):
        response = []
        for url in self.start_urls_list:
            monkeypatch.setattr(
                self.spider.utils,
                "read_from_zoho",
                lambda **kwargs: ([url], self.meta),
            )
            gen = self.spider.start_requests()
            response.append([i for i in gen])
        assert len(response) >= 1
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
)  # handing over html response from selenium

#### With Explicit wait
WebDriverWait(self.driver, self.delay).until(
     EC.presence_of_element_located((By.XPATH, 'Xpath to be found'))
)
body = self.driver.page_source
response = HtmlResponse(
    self.driver.current_url, body=body, encoding="utf-8"
)`,
};
export default preset;
