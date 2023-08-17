export function getSearchNameTermFromQuery(searchNameTerm:  string | undefined): {searchNameTerm: string}{
    const defaultNameTerm = {searchNameTerm: ''};
    if(searchNameTerm) {
        defaultNameTerm.searchNameTerm = searchNameTerm;
        return defaultNameTerm;
    }
    
    return defaultNameTerm;
}