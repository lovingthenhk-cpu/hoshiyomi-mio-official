"""Basic real-browser regression test for Hoshiyomi Mio's static site.

Install: pip install playwright && python -m playwright install chromium
Usage:  python tests/smoke.py [URL]
"""
from __future__ import annotations
import sys
import os
import shutil
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else 'https://lovingthenhk-cpu.github.io/hoshiyomi-mio-official/'

def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True,executable_path=os.environ.get('CHROME_PATH') or shutil.which('google-chrome') or None,args=['--no-sandbox'])
        for width in (320,390,768,1024,1440):
            context=browser.new_context(viewport={'width':width,'height':850},accept_downloads=True)
            page=context.new_page()
            errors=[]
            page.on('pageerror',lambda error:errors.append(str(error)))
            page.goto(URL,wait_until='networkidle',timeout=30000)
            assert page.title().startswith('星詠ミオ')
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'horizontal overflow at {width}'
            assert page.locator('.hero-portrait img').evaluate('img=>img.complete && img.naturalWidth>0')
            assert page.locator('#observatory-clock').inner_text()!='--:--:--'
            if width==390:
                page.locator('#receive').click()
                assert '成功' in page.locator('#signal-status').inner_text()
                page.locator('.sky-star').first.click()
                assert page.locator('#star-count').inner_text()=='1'
                page.locator('#search-open').click()
                page.locator('#site-search-input').fill('壁紙')
                assert page.locator('.site-search-result').count()==1
                page.locator('#search-close').click()
                page.locator('.story-choice').first.click()
                page.locator('.story-choice').first.click()
                assert '1 / 3' in page.locator('#story-counter').inner_text()
                page.locator('#wallpaper-size').select_option('square')
                assert page.locator('#wallpaper-preview').evaluate('c=>c.width===1080 && c.height===1080')
                page.locator('#fan-name').fill('星空テスター')
                page.locator('#fan-form button').click()
                assert '星空テスター' in page.locator('#fan-status').inner_text()
                assert page.locator('#fan-card').evaluate('c=>c.width===1000 && c.height===600')
            assert not errors,errors
            print(f'PASS {width}px')
            context.close()
        browser.close()

if __name__=='__main__':main()
