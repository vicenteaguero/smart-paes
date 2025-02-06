# scraping/degree_scraper.py

from bs4 import BeautifulSoup
from tqdm import tqdm
import requests
import os

BASE_PATH = '..'
SAVE_FOLDER = os.path.join(BASE_PATH, 'data', 'html_degrees')

def get_soup(url: str) -> BeautifulSoup:
    html = requests.get(url)
    if html.status_code == 200:
        return BeautifulSoup(html.text, 'html.parser')
    raise Exception('Failed to get HTML')

def get_links(
    soup: BeautifulSoup,
    to_find: list[tuple[str, str, int]],
    a_info: tuple[str, str, int]
):
    for tag, class_name, find_index in to_find:
        if '#' in class_name:
            soup = soup.find_all(tag, id=class_name[1:])
        else:
            soup = soup.find_all(tag, class_=class_name)
        if find_index is not None:
            soup = soup[find_index]
    if a_info is None:
        return [post['href'] for post in soup]
    else:
        return [
            post.find_all(a_info[0], class_=a_info[1])[a_info[2]]['href']
            for post in soup
            if post.find_all(a_info[0], class_=a_info[1])
        ]

def get_soups(urls: list) -> list:
    soups = dict()
    for url in tqdm(urls):
        try:
            soups[url] = get_soup(url)
        except:
            print(f'Failed to get {url}')
    return soups

def check_data(url: str) -> bool:
    return os.path.exists(
        os.path.join(SAVE_FOLDER, url.split('/')[2].replace('.', '-'))
    )

def save_htmls(
    url: str, pages: list,
    safe_tag: tuple[str, str, int],
    update: bool = False
):
    folder = url.split('/')[2].replace('.', '-')
    save_folder = os.path.join(SAVE_FOLDER, folder)
    if not os.path.exists(save_folder):
        os.makedirs(os.path.join(SAVE_FOLDER, folder))
    else:
        if update:
            for file in os.listdir(save_folder):
                os.remove(os.path.join(save_folder, file))
    for page_url, page in tqdm(pages.items()):
        if '#' in safe_tag[1]:
            html = page.find_all(safe_tag[0], id=safe_tag[1][1:])[safe_tag[2]].prettify()
        else:
            html = page.findAll(safe_tag[0], class_=safe_tag[1])[safe_tag[2]].prettify()
        file = page_url.split('//', 1)[-1].strip('/').translate(str.maketrans('/.:', '---'))
        file = file.replace(folder, '').strip('-')
        with open(os.path.join(SAVE_FOLDER, folder, file+'.html'), 'w') as f:
            f.write(html)

def get_htmls(url: str) -> dict:
    folder = url.split('/')[2].replace('.', '-')
    save_folder = os.path.join(SAVE_FOLDER, folder)
    pages = dict()
    for file in os.listdir(save_folder):
        with open(os.path.join(save_folder, file)) as f:
            pages[file.split('.html')[0]] = BeautifulSoup(f.read(), 'html.parser')
    return pages

def get_degrees(
    url: str,
    to_find: list[tuple[str, str, int]],
    a_info: tuple[str, str, int],
    safe_tag: tuple[str, str, int],
    update: bool = False,
    test: bool = False
):
    if not update:
        if check_data(url):
            return get_htmls(url)
        raise Exception('Data not found, set update=True to scrape data.')
    test_return = list()
    try:
        soup = get_soup(url)
        test_return.append(soup)
        links = get_links(soup, to_find, a_info)
        test_return.append(links)
        print(f'Found {len(links)} degrees')
        if test:
            links = links[:3]
        pages = get_soups(links)
        test_return.append(pages)
        print(f'Found {len(pages)} pages')
        save_htmls(url, pages, safe_tag, update)
        return pages
    except Exception as e:
        print(e)
        if test:
            return test_return
        raise Exception('Failed to get degrees')
