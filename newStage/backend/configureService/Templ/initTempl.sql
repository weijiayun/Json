--基本模板表
CREATE TABLE t_templ
		(id serial, name varchar, version varchar, content varchar,PRIMARY KEY(name,version));
CREATE INDEX i_templ_name ON t_templ (id, name, version, content);

--json关系表
CREATE TABLE t_baserelation
		(id serial, name varchar, version varchar, base varchar,PRIMARY KEY(name,version));
CREATE INDEX i_t_base_relation ON t_templ (id, name, version, base);

--json属性内容表
CREATE TABLE t_jsonattr
		(id serial, name varchar, version varchar, attr varchar,PRIMARY KEY(name,version));
CREATE INDEX i_jsonattr_name ON t_jsonattr (id, name, version, attr);


INSERT INTO t_templ (name, version, content) VALUES
		('TradingRange','1.2','struct TradingRange(struct:Struct)
		{
		    required string End reference DateTime;
		    required string Start reference DateTime;
		}'),
		('IStrategy','1.3','struct IStrategy(Strategy:strategy)
		{
		    required string Name;required sint32 Id;
		    required string Type equal IStrategy;
		}'),
		('TestStrategy','2.1','struct TestStrategy(Strategy:strategy)
		{
		    required vec<Dimension> I;
		    required sint32 Dimension;
		    required OrderType::type OrderType;
		    required sint32 Id;
		    required string Type equal TestStrategy;
		    optional list<TradingRange> Ranges;
		    required string Name;
		    required mat<Dimension> RiskMatrix;
		}'),
		('Automaton','2.2','struct Automaton(IStrategy)
		{
		    required string Type equal Automaton;
		    optional vec<3> I;
		    required sint32 V default 3;
		    optional mat<3,2> RiskMatrix;
		    required sint32 Market reference market;
		}'),
		('OrderType','3.1','enum OrderType::type
		{
		    OTGFD = 0,
		    SIMULATION = 1,
		    IOC = 2,
		    POTF = 3
		}');

INSERT INTO t_baserelation (name, version, base) VALUES
        ('TestStrategy','2.1','strategy'),('Automaton','2.2','IStrategy'),
        ('IStrategy','1.3','strategy'),('OrderType','3.1','type');


INSERT INTO t_jsonattr (name, version, attr) VALUES
        ('Automaton','2.2','Type:{type:string, equal:Automaton}'),
        ('TradingRange','1.2','Start:{type:string,reference:DateTime}');