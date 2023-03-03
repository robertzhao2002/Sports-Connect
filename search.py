def bbref_id(name, number):
    name_lst = [n.strip() for n in name.split(' ')]
    surname = name_lst[-1]
    given_name = name_lst[0]
    return (surname[0], surname[:5]+given_name[:2]+'0'+str(number))

# Solutions: https://www.baseball-reference.com/friv/multifranchise.cgi?level=franch&t1=SDP&t2=PIT