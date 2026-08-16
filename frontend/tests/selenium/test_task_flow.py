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
    wait = WebDriverWait(browser, 15)
    suffix = int(time.time())
    username = f"selenium{suffix}"
    password = "password123"
    task_title = f"Task Selenium {suffix}"

    # --- Register ---
    browser.get(f"{BASE_URL}/register")
    fields = browser.find_elements(By.CSS_SELECTOR, "input")
    fields[0].send_keys(username)
    fields[1].send_keys(f"{username}@example.com")
    fields[2].send_keys(password)
    browser.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    # --- Login ---
    wait.until(conditions.url_contains("/login"))
    fields = browser.find_elements(By.CSS_SELECTOR, "input")
    fields[0].send_keys(username)
    fields[1].send_keys(password)
    browser.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    # --- Wait for dashboard to load (h1.sr-only is present in DOM) ---
    wait.until(conditions.presence_of_element_located((By.CSS_SELECTOR, "h1.sr-only")))

    # --- Create task using the form ---
    browser.find_element(By.CSS_SELECTOR, "input[placeholder='Título']").send_keys(task_title)
    browser.find_element(By.CSS_SELECTOR, "textarea[placeholder='Descrição']").send_keys("Criada pelo Selenium")
    browser.find_element(By.XPATH, "//h2[text()='Nova Tarefa']/following-sibling::form/button[@type='submit']").click()

    # --- Wait for task to appear in the list (title inside h4) ---
    task_h4 = wait.until(
        conditions.presence_of_element_located((By.XPATH, f"//h4[contains(text(), '{task_title}')]"))
    )

    # --- Click the status dot (first clickable element in the task-item-left) ---
    task_item = task_h4.find_element(By.XPATH, "ancestor::div[contains(@class,'task-item')]")
    status_dot = task_item.find_element(By.CSS_SELECTOR, ".task-status-dot")
    status_dot.click()

    # --- Wait for task to appear as completed (has 'completed' class on the dot) ---
    wait.until(
        conditions.presence_of_element_located(
            (By.XPATH, f"//h4[contains(text(), '{task_title}')]/ancestor::div[contains(@class,'task-item')]"
                       f"//div[contains(@class,'task-status-dot') and contains(@class,'completed')]")
        )
    )

    # --- Filter by completed tasks ---
    Select(browser.find_element(By.CSS_SELECTOR, "select[name='status']")).select_by_value("true")

    # --- Verify the completed task is still visible after filtering ---
    wait.until(
        conditions.presence_of_element_located((By.XPATH, f"//h4[contains(text(), '{task_title}')]"))
    )
