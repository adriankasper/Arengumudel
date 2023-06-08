from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import random

serverURL = 'http://localhost:3000'

kysimusVastusStart = 0;

inputValue = input("Mis vastuseid sisestada? (0-2, r - random): ")
isRandom = False

if str(inputValue) == 'r':
    isRandom = True
elif int(inputValue) < 0:
    inputValue = 0
elif int(inputValue) > 2:
    inputValue = 2

email = input("Sisesta veebilehe kasutajanimi: ")
password = input("Sisesta veebilehe kasutaja parool: ")

driver = webdriver.Firefox()

driver.get(serverURL)

driver.find_element_by_id("email").send_keys(email)
driver.find_element_by_id("password").send_keys(password)
driver.find_element_by_class_name("login-button").click()

time.sleep(2)

kysimustikElement = driver.find_elements_by_id("nav-item")[1]
kysimustikElement.click()

driver.find_element_by_class_name("kysimustik-button").click()

class Kysimus:
    def __init__(self, kysimus_id, vastus, eneseanalyys):
        self.kysimus_id = kysimus_id
        self.vastus = vastus
        self.eneseanalyys = eneseanalyys

kysimuseVastused = []

def endQuestionaire():
    try:
        driver.find_element_by_id("end-button").click()
        time.sleep(5)
        return False
    except:
        try:
            driver.find_element_by_class_name("kysimus-plokk")
            return True
        except:
            return False

    

kysimusCount = 0

while endQuestionaire():
    time.sleep(1)
    try:
        kysimusPlokk = driver.find_elements_by_class_name("kysimus-plokk")
        blockButtons = driver.find_elements_by_class_name("kysimuste-plokk-button")
        for kysimus in kysimusPlokk:
            currentVastusContainer = kysimus.find_element_by_class_name("vastuse-valik-container")
            currentVastusInputs = currentVastusContainer.find_elements_by_id("vastus")
            if (isRandom):
                inputValue = random.randint(0, 2)
            currentVastusInputs[int(inputValue)].click()
            currentEnesehinnang = kysimus.find_element_by_id("enesehinnangText")
            currentKysimusTekst = kysimus.find_element_by_class_name("kysimus")
            eneseanalyys = currentKysimusTekst.text[0:4]
            currentEnesehinnang.send_keys(eneseanalyys)
            kysimusCount += 1
            kysimusVastusStart += 1
            kysimuseVastused.append(Kysimus(kysimusCount, kysimusVastusStart, int(inputValue), eneseanalyys))
        time.sleep(5)


        if len(blockButtons) <= 1:
            if blockButtons:
                if blockButtons[0].text == "Jargmine alamplokk":
                    blockButtons[0].click()
                else:
                    raise NameError('no next block button found')
            else:
                driver.find_element_by_id("next-page-button").click()
                time.sleep(5)
            
        else:
            if (blockButtons[1].text == "Jargmine alamplokk"):
                blockButtons[1].click()

    except NameError:
        time.sleep(2)
        try:
            driver.find_element_by_id("next-page-button").click()
            time.sleep(2)
            if endQuestionaire():
                print("Found end button: " + str(driver.find_element_by_id("end-button")))
            else:
                driver.find_element_by_class_name("next-block-button").click()
        except:
            print("Next page button wasnt found")


for kysimus in kysimuseVastused:
    print("id: {0} , vastus: {2}, eneseanalyys: {3}".format(
        str(kysimus.kysimus_id),
        str(kysimus.vastus),
        str(kysimus.eneseanalyys)
    ))



driver.close()

