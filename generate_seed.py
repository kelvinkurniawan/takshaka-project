import sqlite3

# Connect to dev.db
conn = sqlite3.connect('dev.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Tables to seed (in order)
tables_to_seed = ['users', 'categories', 'contents', 'settings', 'pages', 'media_gallery', 'navigation', 'comments']

# Reserved keywords
reserved_keywords = {'order', 'group', 'select', 'from', 'where', 'insert', 'update', 'delete', 'table', 'join', 'on', 'key', 'value', 'index', 'primary'}

inserts = []

for table in tables_to_seed:
    # Get column info
    cursor.execute(f"PRAGMA table_info({table});")
    columns = [row[1] for row in cursor.fetchall()]
    
    # Get data
    cursor.execute(f"SELECT * FROM {table};")
    rows = cursor.fetchall()
    
    for row in rows:
        # Build column names with escaping
        safe_columns = []
        for col in columns:
            if col.lower() in reserved_keywords:
                safe_columns.append(f'[{col}]')
            else:
                safe_columns.append(col)
        
        # Build values
        values = []
        for val in row:
            if val is None:
                values.append('NULL')
            elif isinstance(val, str):
                escaped = val.replace("'", "''")
                values.append(f"'{escaped}'")
            elif isinstance(val, bool):
                values.append('1' if val else '0')
            else:
                values.append(str(val))
        
        insert = f"INSERT INTO {table} ({', '.join(safe_columns)}) VALUES ({', '.join(values)});"
        inserts.append(insert)

# Write to seed file
with open('dev-seed.sql', 'w') as f:
    f.write('\n'.join(inserts))

print(f"✅ Generated {len(inserts)} seed statements from {len(tables_to_seed)} tables")
print(f"📦 Tables: {', '.join(tables_to_seed)}")

conn.close()
