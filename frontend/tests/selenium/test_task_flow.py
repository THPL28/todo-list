import os
import time

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as conditions
from selenium.webdriver.support.ui import Select, WebDriverWait


BASE_URL = os.getenv("SELENIUM_BASE_URL", "http://localhost:5173")


@pytest.fixture
def browser():
    options = webdriver.ChromeOptions()
    if os.getenv("SELENIUM_HEADLESS", "true").lower() == "true":
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--window-size=1280,900")
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()


def test_user_can_create_complete_and_filter_task(browser):
    wait = WebDriverWait(browser, 10)
    suffix = int(time.time())
    username = f"selenium{suffix}"
    password = "password123"
    task_title = f"Task Selenium {suffix}"

    browser.get(f"{BASE_URL}/register")
    fields = browser.find_elements(By.CSS_SELECTOR, "input")
    fields[0].send_keys(username)
    fields[1].send_keys(f"{username}@example.com")
    fields[2].send_keys(password)
    browser.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(conditions.url_contains("/login"))
    fields = browser.find_elements(By.CSS_SELECTOR, "input")
    fields[0].send_keys(username)
    fields[1].send_keys(password)
    browser.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(conditions.presence_of_element_located((By.TAG_NAME, "h1")))
    browser.find_element(By.CSS_SELECTOR, "input[placeholder='Título']").send_keys(task_title)
    browser.find_element(By.CSS_SELECTOR, "textarea").send_keys("Criada pelo Selenium")
    browser.find_element(By.XPATH, "//h2[text()='Nova Tarefa']/following-sibling::form/button").click()

    task = wait.until(conditions.presence_of_element_located((By.XPATH, f"//strong[text()='{task_title}']/..")))
    task.find_element(By.TAG_NAME, "button").click()
    wait.until(conditions.text_to_be_present_in_element(task, "Concluída: Sim"))

    Select(browser.find_element(By.CSS_SELECTOR, "select[name='status']")).select_by_value("true")
    wait.until(conditions.presence_of_element_located((By.XPATH, f"//strong[text()='{task_title}']")))
