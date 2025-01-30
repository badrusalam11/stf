from rethinkdb import r

conn = r.connect(host='localhost', port=28015, db='test')

r.table('test').update({'new_column': 'default_value'}).run(conn)

# r.db('test').table('test').limit(5).run()
