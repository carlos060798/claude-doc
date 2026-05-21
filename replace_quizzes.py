#!/usr/bin/env python3
import json
import re

# Leer los quizzes nuevos
with open(r'C:\Users\usuario\claude doc\QUIZZES_BLOOM.json', 'r', encoding='utf-8') as f:
    quizzes_data = json.load(f)

# Leer el archivo script.js
with open(r'C:\Users\usuario\claude doc\script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Para cada nivel (1-6), reemplazar su quiz
for level in ['1', '2', '3', '4', '5', '6']:
    if level not in quizzes_data:
        continue

    quiz_items = quizzes_data[level]['quiz']

    # Generar el nuevo código del quiz
    quiz_code = "            quiz: [\n"
    for item in quiz_items:
        quiz_code += '                {\n'
        quiz_code += f"                    q: '{item['q']}',\n"
        quiz_code += "                    options: [\n"
        for option in item['options']:
            quiz_code += f"                        '{option}',\n"
        quiz_code += "                    ],\n"
        quiz_code += f"                    correct: {item['correct']},\n"
        quiz_code += f"                    explain: '{item['explain']}',\n"
        quiz_code += '                },\n'
    quiz_code += "            ],"

    # Encontrar y reemplazar el quiz del nivel
    # Patrón: buscar "quiz: [" dentro del bloque del nivel N y reemplazarlo hasta el siguiente "],"

    if level in ['1', '3', '5']:
        # Búsqueda para niveles 1, 3, 5 (antes de mission)
        pattern = rf"({level}: \{{[^}}]*quiz:) \[(.*?)\],(.*?mission:)"
        replacement = rf"\1 {quiz_code}\3mission:"
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    elif level in ['2', '4', '6']:
        # Búsqueda para niveles 2, 4, 6
        pattern = rf"({level}: \{{[^}}]*quiz:) \[(.*?)\],(.*?(?:mission:|),.*?}})"
        replacement = rf"\1 {quiz_code}\3"
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Escribir el resultado
with open(r'C:\Users\usuario\claude doc\script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Quizzes reemplazados exitosamente.")
