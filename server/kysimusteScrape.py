import os
import sys
import pandas

# rida 120 tase 7 kysimustiku lopp
# INSERT INTO Kysimus (kysimus_tekst, kysimusteplokk_id) VALUES ("kysimusetekst", ploki FK)
# INSERT INTO KysimustePlokk (kysimusteplokk_nimi, kysimustik_id) VALUES ("kysimuseplokinimi", kysimustikuid FK)
# INSERT INTO Kysimustik (kysimustik_pealkiri) VALUES ("kysimustiku pealkiri")


kysimustikPath = "/home/mait/Documents/Programming/opetaja-prof-arengu-mudel/server/kysimustik/KS_tegevusnaitajad_tasemeti.xlsx"
outputPath = os.path.join(
    sys.path[0], "kysimustik/ks_tegevusnaitajad_tase7.txt")

pealkiri = "KS tegevusnäitajad ja tagasiside Tase 7"


data = pandas.read_excel(
    kysimustikPath, sheet_name="KS tegevusnäitajad ja tagasisid")

plokkCounter = 0
kysimuseCounter = 1
f = open(outputPath, "a")

f.write(
    'INSERT INTO Kysimustik (kysimustik_pealkiri) VALUES ("{0}");\n'.format(pealkiri))

for i in range(0, 120):
    if not pandas.isnull(data['Unnamed: 1'][i]) and i > 1:
        row = 'INSERT INTO KysimustePlokk (kysimusteplokk_nimi, kysimustik_id) VALUES ("{0}", 1);\n'.format(
            data['Unnamed: 1'][i])
        f.write(row)
        plokkCounter += 1

    if not pandas.isnull(data['Unnamed: 2'][i]) and i > 3:
        row = 'INSERT INTO Kysimus (kysimus_tekst, kysimusteplokk_id) VALUES ("{0}", {1});\n'.format(
            data['Unnamed: 2'][i], plokkCounter)
        f.write(row)
        if not pandas.isnull(data['Unnamed: 5'][i]):
            row = 'INSERT INTO Soovitus (soovitus_tekst, kysimus_id) VALUES ("{0}", {1});\n'.format(
                data['Unnamed: 5'][i], kysimuseCounter)
            f.write(row)
        kysimuseCounter += 1

f.close()
