import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  include MixinStorage();

  type Language = {
    #english;
    #danish;
    #bulgarian;
    #spanish;
    #turkish;
  };

  module Language {
    public func compare(lang1 : Language, lang2 : Language) : Order.Order {
      switch (lang1, lang2) {
        case (#english, #english) { #equal };
        case (#english, _) { #less };
        case (_, #english) { #greater };
        case (#danish, #danish) { #equal };
        case (#danish, _) { #less };
        case (_, #danish) { #greater };
        case (#bulgarian, #bulgarian) { #equal };
        case (#bulgarian, _) { #less };
        case (_, #bulgarian) { #greater };
        case (#spanish, #spanish) { #equal };
        case (#spanish, _) { #less };
        case (_, #spanish) { #greater };
        case (#turkish, #turkish) { #equal };
      };
    };
  };

  type Newsletter = {
    id : Nat;
    title : Text;
    description : Text;
    status : Text;
    publicationDate : Text;
    pdf : ?Storage.ExternalBlob;
  };

  let newsletters = Map.empty<Nat, Newsletter>();

  let translations = Map.empty<Language, Map.Map<Text, Text>>();

  public shared ({ caller }) func addTranslation(language : Language, key : Text, value : Text) : async () {
    let langMap = switch (translations.get(language)) {
      case (null) {
        let newMap = Map.empty<Text, Text>();
        translations.add(language, newMap);
        newMap;
      };
      case (?map) { map };
    };
    langMap.add(key, value);
  };

  public query ({ caller }) func getTranslation(language : Language, key : Text) : async Text {
    switch (translations.get(language)) {
      case (null) { Runtime.trap("Language not found") };
      case (?langMap) {
        switch (langMap.get(key)) {
          case (null) { "" };
          case (?value) { value };
        };
      };
    };
  };

  public shared ({ caller }) func addNewsletter(
    id : Nat,
    title : Text,
    description : Text,
    status : Text,
    publicationDate : Text,
    pdf : ?Storage.ExternalBlob,
  ) : async () {
    let newsletter : Newsletter = {
      id;
      title;
      description;
      status;
      publicationDate;
      pdf;
    };
    newsletters.add(id, newsletter);
  };

  public query ({ caller }) func getNewsletter(id : Nat) : async Newsletter {
    switch (newsletters.get(id)) {
      case (null) { Runtime.trap("Newsletter not found") };
      case (?newsletter) { newsletter };
    };
  };

  public query ({ caller }) func getAllNewsletters() : async [Newsletter] {
    newsletters.values().toArray();
  };

  public query ({ caller }) func getPDF(id : Nat) : async ?Storage.ExternalBlob {
    switch (newsletters.get(id)) {
      case (null) { Runtime.trap("Newsletter not found") };
      case (?newsletter) { newsletter.pdf };
    };
  };

  public shared ({ caller }) func updateNewsletterPDF(id : Nat, pdf : Storage.ExternalBlob) : async () {
    switch (newsletters.get(id)) {
      case (null) { Runtime.trap("Newsletter not found") };
      case (?newsletter) {
        let updatedNewsletter : Newsletter = {
          id = newsletter.id;
          title = newsletter.title;
          description = newsletter.description;
          status = newsletter.status;
          publicationDate = newsletter.publicationDate;
          pdf = ?pdf;
        };
        newsletters.add(id, updatedNewsletter);
      };
    };
  };

  public query ({ caller }) func getAvailableLanguages() : async [Language] {
    translations.keys().toArray();
  };

  public shared ({ caller }) func correctNewsletter1PublicationDate() : async () {
    switch (newsletters.get(1)) {
      case (null) { Runtime.trap("Newsletter 1 not found") };
      case (?newsletter) {
        let updatedNewsletter : Newsletter = {
          id = newsletter.id;
          title = newsletter.title;
          description = newsletter.description;
          status = newsletter.status;
          publicationDate = "December 2025";
          pdf = newsletter.pdf;
        };
        newsletters.add(1, updatedNewsletter);
      };
    };
  };
};
